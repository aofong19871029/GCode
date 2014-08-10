/**
 * h5 update
 */


;
(function (WIN, $, undefined) {
    "use strict";

    var EMPTY = "",
        NOOP = function () {
        },
        canvas = (function () {
            var cavs = document.createElement('canvas');
            document.body.appendChild(cavs);
            return cavs;
        })(),

        isCanvasSupported = function () {
            return !!(canvas.getContext && canvas.getContext('2d'));
        },
        getFunction = function (fn) {
            return $.isFunction(fn) ? fn : NOOP;
        },
        optionsValidate = function (opt) {
            var container = opt.container,
                size = opt.size.toUpperCase().split(' '),
                compress = opt.compress,
                listener = opt.listener;

            if (!container)  throw ERROR.ARGUMENTS_EXCEPTION;
            if (!$.isNumeric(size[0])) throw ERROR.ARGUMENTS_EXCEPTION;
            if (compress && compress.enable) {
                if (isNaN(compress.width) || isNaN(compress.height)) throw ERROR.ARGUMENTS_EXCEPTION;
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
                onBeforeUpload: getFunction(opt.listener.onBeforeUpload)
            }

            return $.extend(true, opt, {
                size: size,
                listener: listener
            });
        },
        isH5FullSupported = function () {
            var result = WIN.FormData && WIN.FileReader && isCanvasSupported(),
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
        },

        ERROR = {
            FILE_EXCEEDS_TYPE: {code: -150, msg: '文件类型非法'},
            FILE_EXCEEDS_SIZE_LIMIT: {code: -100, msg: '文件大小超过限定尺寸'},
            UPLOAD_FILE_CANCELLED: {code: -120, msg: '文件上传被取消'},
            ARGUMENTS_EXCEPTION: {code: -130, msg: '参数异常' },
            FILE_READ_ERROR: {code: -110, msg: '文件读取失败'},
            IMAGE_LOAD_ERROR: {code: -140, msg: '图片解析失败'}
        },

        DEFAULT_OPTION = {
            url: "Tool/AjaxUploadCommentImage.aspx",
            size: "2 MB",
            types: "image/gif,image/jpeg,image/png",
            params: {},
            multiple: true,
            container: null,
            compress: {
                enable: true,
                height: 30,
                width: 30
            },

            // 对外事件接口
            listener: {
                onUploadStart: NOOP,
                onUploadError: NOOP,
                onUploadSuccess: NOOP,
                onFileQueueError: NOOP,
                onProgress: NOOP
            }
        };


    function H5Upload(options) {
        var self = this,
            settings = $.extend(true, {}, DEFAULT_OPTION, options);

        self.__opt = optionsValidate(settings);
        self._container = container;
        self.__busy = false;
        // upload file cache queue
        self._cache = [];
        // xmlhttprequest cache queue
        self._xhqCache = [];

        self.initialize();
    }

    H5Upload.prototype = {
        constructor: H5Upload,
        initialize: function () {
            var self = this;

            if (!self.__file) {
                self.__file = document.createElement('input');
                self.__file.type = 'file';
                self.__file.multiple = self.__opt.multiple && isH5FullSupported();
                document.body.appendChild(self.__file);
            }

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

            // 如果禁用了文件压缩则检查文件大小
            if (!opt.compress || !opt.compress.enable) {
                if (file.size > maxSize) {
                    ex.push(ERROR.FILE_EXCEEDS_SIZE_LIMIT);
                }
            }
            if (types.indexOf(file.type.toLowerCase()) === -1) {
                ex.push(ERROR.FILE_EXCEEDS_TYPE);
            }
            return ex;
        },
        queue: function (e) {
            var self = this,
                listener = self.__opt.listener,
                files = e.target.files,
                ex,
                uploadFn = function () {
                    if (self._cache.length) {
                        if (!self.__busy)
                            self.loadFile(self._cache.pop());
                        else
                            timer = setTimeout(uploadFn, 20);
                    }
                    else {
                        clearTimeout(timer);
                    }
                },
                timer;

            for (var i = 0; i < files.length; i++) {
                ex = self.__validateFile(files[i]);
                if (ex.length) {
                    listener.onFileQueueError(files[i], ex);
                }
                else {
                    self._cache.push(files[i]);
                }
            }

            listener.onUploadStart.call(self, self._cache);
            timer = setTimeout(uploadFn, 20);
        },
        loadFile: function (file) {
            var self = this,
                listener = self.__opt.listener,
                total = file.size,
                loaded = 0,
                reader;

            self.__busy = 1;

            if (!isH5FullSupported()) {
                self.upload({
                    obj: file,
                    type: 'file'
                });
                return;
            }

            reader = new FileReader();
            reader.onprogress = function (e) {
                loaded += e.loaded;
                listener.onProgress(loaded, total, 'FileReader', file);
            }
            reader.onerror = function () {
                listener.onUploadError(file, ERROR.FILE_READ_ERROR);
                self.__busy = 0;
                file = undefined;
            }
            reader.onload = function (e) {
                var img = self._container[0],
                    dataUrl = e.target.result;

                img.onload = function () {
                    self.upload({
                        obj: dataUrl,
                        type: 'dataurl',
                        allowSize: img.size <= self.__opt.size
                    });
                };
                img.onerror = function () {
                    self.__opt.listener.onUploadError(ERROR.IMAGE_LOAD_ERROR);
                    self.__busy = 0;
                };
                file = undefined;
                self._container.src = dataUrl;
            }

            //TODO: 此处应分段读取
            reader.readAsDataURL(file);
        },
        upload: function (obj) {
            var self = this,
                compress = self.__opt.compress,
                type = obj.type,
                file = obj.obj;

            if (type === 'file') {
                self.uploadSingleFile(file, 'file');
            }
            else if (type === 'dataurl') {
                // 大小>maxsize, 且压缩后上传
                if (compress && compress.enable && !file.allowSize) {
                    zip(obj.obj);
                }
                else {
                    self.uploadSingleFile(file, 'dataurl');
                }
            }
            else {
                self.__busy = 0;
            }
        },
        zip: function (file) {
            var self = this,
                compress = self.__opt.compress,
                cxt = canvas.getContext('2d');

            cxt.clearRect(0, 0, canvas.width, canvas.height);
            cxt.width = compress.width;
            cxt.height = compress.height;
            ctx.drawImage(file, 0, 0, compress.width, compress.height);

            self.uploadSingleFile(ctx.toDataURL('image/png'), 'dataurl');
        }
    };

})(window, Zepto);
