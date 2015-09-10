/**
 * h5 update
 */


;
define(['exif'], function (EXIF) {
    "use strict";

    var EMPTY = "",
        WIN = window,
        NOOP = function () { },
        createCanvas = function () {
            var cavs = document.createElement('canvas');
            cavs.className = 'hidden';
            document.body.appendChild(cavs);
            return cavs;
        },
        Blob = WIN.Blob || WIN.webkitBlob || WIN.WebKitBlob,
        BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder,

        isNumeric = function (obj) {
            return !$.isArray(obj) && obj - parseFloat(obj, 10) >= 0;
        },
        getFunction = function (fn) {
            return $.isFunction(fn) ? fn : NOOP;
        },
        optionsValidate = function (opt) {
            var container = opt.container,
                size = opt.size.toUpperCase().split(' '),
                compress = opt.compress = false,  //@jian_chen 关闭压缩
                listener = opt.listener;

            if (!container) throw ERROR.ARGUMENTS_EXCEPTION;
            if (!isNumeric(size[0])) throw ERROR.ARGUMENTS_EXCEPTION;
            if (compress && compress.enable && !isNumeric(compress.quality)) {
                throw ERROR.ARGUMENTS_EXCEPTION;
            }
            if (size.length > 1) {
                switch (size[1]) {
                    case 'MB':
                        size = size[0] * 1024 * 1024;
                        break;
                    case 'KB':
                        size = size[0] * 1024;
                        break;
                }
            }
            listener = {
                onUploadStart: getFunction(opt.listener.onUploadStart),
                onUploadError: getFunction(opt.listener.onUploadError),
                onUploadSuccess: getFunction(opt.listener.onUploadSuccess),
                onFileQueueError: getFunction(opt.listener.onFileQueueError),
                onProgress: getFunction(opt.listener.onProgress),
                onBeforeUpload: getFunction(opt.listener.onBeforeUpload),
                onAnalizyDone: getFunction(opt.listener.onAnalizyDone)
            };

            return $.extend(true, opt, {
                size: size,
                listener: listener
            });
        },
        isCanvasSupported = (function () {
            var cavs = createCanvas();

            return !!(cavs.getContext && cavs.getContext('2d'));
        })(),
        isH5FullSupported = (function () {
            // Blob & Uint8Array base64 to file
            var result = WIN.FormData && WIN.FileReader && Blob && WIN.Uint8Array && WIN.atob && isCanvasSupported,
                xhq;

            if (result) {
                try {
                    xhq = new XMLHttpRequest();
                    result = xhq.withCredentials != null;
                }
                catch (err) {
                    result = false;
                }
            }
            return !!result;
        })(),
        createFileInput = function (parent) {
            var input = document.createElement('input');
            input.type = 'file';
            parent.append(input);
            $(input).addClass('nofastclick');
            return $(input);
        },
        copyFileInput = function (file) {
            // ie需要clone才能彻底清楚文件上传记录
            var cloned = file.clone().val(EMPTY);
            file.after(cloned);
            file.remove();
            return cloned;
        },
    // consform from dataURI to file object
        dataURLToBlob = function (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString,
                mimeString,
                ia,
                file;

            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            try {
                file = new Blob([ia], { type: mimeString });
            }
            catch (e) {
                try {
                    // UC, QQ浏览器兼容，需要使用老的BlobBuilder类来转换文件
                    if (e.name == 'TypeError' && BlobBuilder) {
                        var builder = new BlobBuilder();
                        builder.append(ia);
                        file = builder.getBlob(mimeString);
                    }
                }
                catch (r) { }
            }
            return file;
        },

        ERROR = {
            FILE_EXCEEDS_TYPE: { code: -150, msg: '请上传图片证件照(.jpg, .png, .gif)' },
            FILE_EXCEEDS_SIZE_LIMIT: { code: -100, msg: '图片不能超过5MB' },
            UPLOAD_FILE_CANCELLED: { code: -120, msg: '文件上传被取消' },
            ARGUMENTS_EXCEPTION: { code: -130, msg: '参数异常' },
            FILE_READ_ERROR: { code: -110, msg: '文件读取失败' },
            IMAGE_LOAD_ERROR: { code: -140, msg: '图片解析失败' },
            NETWORK_ERROR: { code: -160, msg: '网络传输失败' },
            UPLOAD_LOGIC_ERROR: { code: -170, msg: '服务返回上传失败' }
        },

        DEFAULT_OPTION = {
            url: "ImageUpload",
            size: "5 MB",
            types: "image/gif,image/jpeg,image/png",
            params: {},

            container: null,
            file: null,
            compress: {
                enable: true,
                quality: 0.8
            },

            // 对外事件接口
            listener: {
                onUploadStart: NOOP,
                onUploadError: NOOP,
                onUploadSuccess: NOOP,
                onFileQueueError: NOOP,
                onProgress: NOOP,
                onAnalizyDone: NOOP
            }
        };


    function H5Upload(options) {
        var self = this,
            settings = optionsValidate($.extend(true, {}, DEFAULT_OPTION, options));

        self.__opt = settings;
        self._container = settings.container;
        self.__file = settings.file;
        // self._img =new Image();
        self.__busy = false;
        // upload file cache queue
        self._cache = [];
        // focus switch for check and upload
        self.__focusUpload = 0;
        // create canvas
        self.__canvas = createCanvas();

        self.initialize();
    }

    H5Upload.prototype = {
        constructor: H5Upload,
        initialize: function () {
            var self = this,
                input;

            !self.__file && (self.__file = createFileInput(self._container));

            self.__file.attr('accept', '.jpg, .png, .gif');
            !isH5FullSupported && self.__file.attr('multiple', 'true');
            self.__bindEvents();

        },
        __bindEvents: function () {
            var self = this;
            self.__file.on('change', self.queue.bind(self));
        },
        __validateFile: function (file) {
            var self = this,
                opt = self.__opt,
                types = opt.types.toLowerCase().split(','),
                maxSize = opt.size,
                ex = [];

            // 只能上传jpg, png, gif
            if (types.indexOf(file.type.toLowerCase()) === -1) {
                ex.push(ERROR.FILE_EXCEEDS_TYPE);
            }
            // 如果禁用了文件压缩或启用强制上传则检查文件大小
            if (!opt.compress || !opt.compress.enable || self.__focusUpload) {
                if (file.size > maxSize) {
                    ex.push(ERROR.FILE_EXCEEDS_SIZE_LIMIT);
                }
            }
            return ex;
        },
        /*
        * 对上传文件进行排队
        * @param reupload
        *
        * reupload: 图片压缩失败会设置为true, 进行重传
        * reupload时 不再触发uploadstart方法
        */
        queue: function (e, reupload) {
            var self = this,
                listener = self.__opt.listener,
                files = e.target.files,
                ex,
                uploadFn = function () {
                    if (self._cache.length) {
                        if (!self.__busy) {
                            self.loadFile(self._cache.pop());
                        }
                        else {
                            timer = setTimeout(uploadFn, 20);
                        }
                    }
                    else {
                        clearTimeout(timer);
                    }
                },
                timer;

            for (var i = 0; i < files.length; i++) {
                ex = self.__validateFile(files[i]);
                if (ex.length) {
                    listener.onFileQueueError(files[i], ex, self._container);
                    self.reset();
                }
                else {
                    self._cache.push(files[i]);
                }
            }

            // 清楚上传控件域的历史记录，复制file
            self.__file = copyFileInput(self.__file);
            self.__bindEvents();

            if (ex.length) {
                self._cache = [];
                return;
            }

            if (!reupload) {
                listener.onUploadStart(self._cache, self._container);
            }
            timer = setTimeout(uploadFn, 20);
        },
        /**
        * 解析原图
        * @param {file} 上传的文件
        */
        loadFile: function (file) {
            var self = this,
                opt = self.__opt,
                container = self._container,
                listener = opt.listener,
                total = file.size,
                loaded = 0,
                reader;

            self.__busy = 1;
            self.__tmplFile = file;
            // 不支持H5, 禁用文件压缩, 或启用了强制上传
            if (!isH5FullSupported || !opt.compress || !opt.compress.enable || self.__focusUpload) {
                self.upload({
                    obj: file,
                    type: 'file'
                });
                return;
            }

            reader = new FileReader();
            reader.onerror = function () {
                listener.onUploadError(ERROR.FILE_READ_ERROR, container, file);
                self.reset();
                file = undefined;
            };
            reader.onload = function (e) {
                var img = new Image(),
                    base64 = e.target.result;

                img.onload = function () {
                    self.upload({
                        obj: base64,
                        type: 'base64',
                        allowSize: img.size <= opt.size
                    });
                    listener.onAnalizyDone(base64, container);
                    img = null;
                };
                img.onerror = function () {
                    listener.onUploadError(ERROR.IMAGE_LOAD_ERROR, container);
                    self.reset();
                    img = null;
                };
                file = undefined;
                img.src = base64;
            };

            //TODO: 此处应分段读取
            reader.readAsDataURL(file);
        },
        upload: function (obj) {
            var self = this,
                opt = self.__opt,
                compress = opt.compress,
                type = obj.type,
                file = obj.obj;

            if (type === 'file') {
                self.uploadSingleFile(file);
            }
            else if (type === 'base64') {

                // 大小>maxsize, 且压缩后上传
                if (compress && compress.enable && !file.allowSize) {
                    self.zip(obj.obj);
                }
                else {
                    self.uploadSingleFile(dataURLToBlob(file));
                }
            }
            else {
                self.reset();
            }
        },
        /**
        * 压缩图片
        *
        */
        zip: function (base64) {
            var self = this,
                compress = self.__opt.compress,
                canvas = self.__canvas,
                cxt = canvas.getContext('2d'),
                img = new Image(),
                zipBase64;

            img.onerror = function () {
                self.reset();
                img = null;
                self.__opt.listener.onUploadError(ERROR.IMAGE_LOAD_ERROR, self._container);
            };
            img.onload = function () {
                cxt.clearRect(0, 0, canvas.width, canvas.height);
                cxt.save();

                canvas.width = img.width;
                canvas.height = img.height;

                self._correctImageOrientation(img, function () {
                    zipBase64 = canvas.toDataURL(self.__tmplFile.type, compress.quality);

                    canvas.width = img.width;
                    canvas.height = img.height;
                    cxt.restore();

                    self.uploadSingleFile(dataURLToBlob(zipBase64));
                    img = null;
                });
            };
            img.src = base64;
        },
        /**
        * 更正相机和个别类型手机相册 改变图片orientation
        * @param img
        * @param callback
        * @private
        */
        _correctImageOrientation: function (img, callback) {
            var canvas = this.__canvas,
                cxt = canvas.getContext('2d');

            EXIF.getData(img, function () {
                var pretty = EXIF.pretty(this),
                    orientation = pretty.Orientation,
                    transform = 'none',
                    width,
                    height;

                // 识别图片中的orientation
                switch (orientation) {
                    case 8:
                        width = canvas.height;
                        height = canvas.width;
                        transform = "left";
                        break;
                    case 6:
                        width = canvas.height;
                        height = canvas.width;
                        transform = "right";
                        break;
                    case 1:
                        width = canvas.width;
                        height = canvas.height;
                        break;
                    case 3:
                        width = canvas.width;
                        height = canvas.height;
                        transform = "flip";
                        break;
                    default:
                        width = canvas.width;
                        height = canvas.height;
                        break;
                }

                canvas.height = height;
                canvas.width = width;

                // 反向修正orientation
                switch (transform) {
                    case 'left':
                        cxt.setTransform(0, -1, 1, 0, 0, height);
                        cxt.drawImage(img, 0, 0, height, width);
                        break;
                    case 'right':
                        cxt.setTransform(0, 1, -1, 0, width, 0);
                        cxt.drawImage(img, 0, 0, height, width);
                        break;
                    case 'flip':
                        cxt.setTransform(1, 0, 0, -1, 0, height);
                        cxt.drawImage(img, 0, 0, width, height);
                        break;
                    default:
                        cxt.setTransform(1, 0, 0, 1, 0, 0);
                        cxt.drawImage(img, 0, 0, width, height);
                        break;
                }

                cxt.setTransform(1, 0, 0, 1, 0, 0);


                if ($.isFunction(callback)) {
                    callback();
                }
            });
        },
        uploadSingleFile: function (file) {
            var self = this;

            // 如果file为空，即文件转解析失败
            // 重新将文件压入队列，进行强制上传
            if ((!file || file.size < 50) && !self.__focusUpload) {
                self.reset();
                self.__focusUpload = 1;
                self.queue({
                    target: {
                        files: {
                            0: self.__tmplFile,
                            length: 1
                        }
                    }
                }, true);
                return;
            }

            var opt = self.__opt,
                container = self._container,
                url = opt.url,
                listener = opt.listener,
                params = opt.params,
                xhq = new XMLHttpRequest(),
                form = new FormData();

            xhq.open("post", url, true);

            xhq.upload.addEventListener("progress", function (e) {
                if (e.lengthComputable) {
                    listener.onProgress(e.loaded, e.total, container, { type: 'AjaxUpload', file: file });
                }
            }, false);

            xhq.upload.addEventListener("error", function (e) {
                if (e.lengthComputable) {
                    self.reset();
                    listener.onUploadError(ERROR.NETWORK_ERROR);
                }
            }, false);

            xhq.addEventListener("readystatechange", function () {
                if (xhq.readyState === 4) {
                    // 清除原文件缓存
                    self.__tmplFile = undefined;
                    self.reset();
                    if (xhq.status >= 200 && xhq.status < 300 || xhq.status === 304) {
                        listener.onUploadSuccess(xhq.responseText, container);
                    }
                    else {
                        listener.onUploadError(ERROR.UPLOAD_LOGIC_ERROR, container, xhq.responseText, xhq, file);
                    }
                    form = null;
                    xhq = null;
                }
            }, false);

            if (params) {
                for (var key in params) {
                    form.append(key, params[key]);
                }
            }
            form.append("file", file);
            xhq.send(form);
        },
        /**
        * 将状态值归为，__busy 和 __focusUpload
        */
        reset: function () {
            this.__busy = 0;
            this.__focusUpload = 0;
        }
    };


    return H5Upload;
});