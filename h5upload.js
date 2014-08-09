/**
 * h5 update
 * User: jian_chen
 * Date: 14-2-25
 * Time: ä¸‹åˆ7:52
 * To change this template use File | Settings | File Templates.
 */
(function (window, $, undefined) {
    "use strict";

    var EMPTY = "",
        NOOP = function () {
        },

        isSupportHTML5 = function () {
            var result = window.FormData && window.FileReader,
                canvas =
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
            FILE_EXCEEDS_SIZE_LIMIT: -110,
            QUEUE_LIMIT_EXCEEDED: -100,
            UPLOAD_FILE_CANCELLED: -280
        },

        DEFAULT_OPTION = {
            url: "Tool/AjaxUploadCommentImage.aspx",
            size: "2 MB",
            types: "image/gif,image/jpeg,image/png",
            params: {},
            multiple: true,
            uploadBtn: null,
            compress:{

            },

            // 对外事件接口
            listener: {
                onUploadStart: NOOP,
                onUploadError: NOOP,
                onUploadSuccess: NOOP,
                onFileQueueError: NOOP,
                onProgress: NOOP,
                onBeforeUpload: NOOP
            }
        }

    function H5Upload(options) {
        var self = this,
            settings = $.extend(true, {}, DEFAULT_OPTION, options),
            container = settings.container;

        if (!container || !isSupportHTML5()) {
            return {};
        }

        settings.upload_start_handler = isFunction(settings.upload_start_handler) ? settings.upload_start_handler : NOOP;
        settings.upload_error_handler = isFunction(settings.upload_error_handler) ? settings.upload_error_handler : NOOP;
        settings.upload_success_handler = isFunction(settings.upload_success_handler) ? settings.upload_success_handler : NOOP;
        settings.file_queue_error_handler = isFunction(settings.file_queue_error_handler) ? settings.file_queue_error_handler : NOOP;
        settings.upload_progress_handler = isFunction(settings.upload_progress_handler) ? settings.upload_progress_handler : NOOP;
        settings.file_dialog_complete_handler = isFunction(settings.file_dialog_complete_handler) ? settings.file_dialog_complete_handler : NOOP;

        self._settings = settings;
        self._container = container;
        self._disabled = false;
        // upload file cache queue
        self._cache = [];
        // xmlhttprequest cache queue
        self._xhqCache = [];

        // å…¼å®¹swfupload
        self.startUpload = self.upload;
        self.getStats = function () {
            return {
                files_queued: self._cache.length
            }
        }
        self.settings = self._settings;
        self.setPostParams = NOOP;

        self._initialize();
    }

    H5Upload.prototype = {
        constructor: H5Upload,
        _initialize: function () {
            var self = this,
                settings = self._settings,
                container = self._container,
                sizeLimit = ((settings.file_size_limit || maxSize) + " ").split(" "),
                size = maxSize;

            // è®¡ç®—æ–‡ä»¶å¤§å°é™åˆ¶ï¼Œåªé™MB, KB, å­—èŠ‚
            sizeLimit[0] = parseInt(sizeLimit[0], 10);
            if (!isNaN(sizeLimit[0])) {
                switch (sizeLimit[1]) {
                    case "MB":
                        size = sizeLimit[0] * 1024 * 1024;
                        break;
                    case "KB":
                        size = sizeLimit[0] * 1024;
                        break;
                    default:
                        size = sizeLimit[0];
                        break;
                }
            }

            container.accept = settings.file_h5types;
            container.multiple = !!settings.multiple_upload;
            container.dataset.maxsize = size;
            self._container = container;

            self._bindEvents();
        },
        _bindEvents: function () {
            var self = this,
                settings = self._settings,
                container = self._container;

            container.addEventListener("change", function (e) {
                self.queue.call(self, e.target.files);
            }, false);
            self._container = container;
        },
        _validate: function (file) {
            var self = this,
                settings = self._settings,
                container = self._container,
                allowTypes = settings.file_h5types.toLowerCase().split(","),
                maxSize = container.dataset.maxsize,
                result = [true];

            // å…¼å®¹swfupload
            if (file.size > maxSize) {
                result = [false, ERROR.FILE_EXCEEDS_SIZE_LIMIT];
            }
            else if (allowTypes.indexOf(file.type.toLowerCase()) === -1) {
                result = [false, ERROR.QUEUE_LIMIT_EXCEEDED];
            }

            return result;
        },
        _buildPostQueryParams: function () {
            var self = this,
                settings = self._settings,
                params = settings.post_params,
                queryString = EMPTY;

            for (var key in params) {
                queryString += key + "=" + params[key] + "&";
            }

            if (queryString !== EMPTY) {
                queryString = (settings.isQbo ? "&" : "?") + queryString.substring(0, queryString.length - 1);
            }
            return queryString;
        },
        queue: function (files) {
            var self = this,
                file,
                settings = self._settings,
                validateResult;

            if (this._disabled) {
                return;
            }

            self._cache = [];
            self._fileTotal = 0;
            for (var i = 0, l = files.length; i < l; i++) {
                file = files[i];
                validateResult = self._validate(file);
                if (validateResult[0]) {
                    self._cache.push(file);
                }
                else {
                    settings.file_queue_error_handler.call(self, file, validateResult[1]);
                    self.cancelUpload();
                    return;
                }
            }
            self.setButtonDisabled(true);
            self._fileTotal = self._cache.length;

            settings.file_dialog_complete_handler.call(self, self._cache.length);
            // è‡ªåŠ¨ä¸Šä¼
            if (settings.auto_multiple_upload) {
                self.upload();
            }
        },
        upload: function () {
            var self = this,
                settings = self._settings,
                xhq = new XMLHttpRequest(),
                file = self._cache.pop(),
                queryString,
                uploadUrl,
                postForm = new FormData(),
                destory = function () {
                    xhq = null;
                    postForm = null;
                }

            self._cache.busy = file != undefined;
            self._disabled = file != undefined;
            // é˜Ÿåˆ—å·²æ¸…ç©º
            if (file == undefined) {
                return destory();
            }

            settings.upload_start_handler.call(self, file);
            // æ‹¼è£…ajaxurl
            queryString = self._buildPostQueryParams();
            uploadUrl = settings.upload_url + queryString;

            xhq.open("post", uploadUrl, true);
            xhq.upload.addEventListener("progress", function () {
                // å‚æ•°ä¸º: file, complete, total
                settings.upload_progress_handler.call(self, file, self._fileTotal - self._cache.length, self._fileTotal);
            }, false);

            xhq.addEventListener("readystatechange", function () {
                console.log(xhq.readyState);
                if (xhq.readyState === 4) {
                    self._cache.busy = false;
                    if (xhq.status >= 200 && xhq.status < 300 || xhq.status === 304) {
                        settings.upload_success_handler.call(self, file, xhq.responseText, xhq);
                    }
                    else {
                        settings.upload_error_handler.call(self, file, 0, xhq.responseText);
                    }
                    destory();
                    // è‡ªåŠ¨ä¸Šä¼
                    if (settings.auto_multiple_upload) {
                        self.upload();
                    }
                }
            }, false);

            postForm.append("file", file);
            // Send the file
            if ("getAsBinary" in file) {
                //FF 3.5 ~ ff7
                xhq.sendAsBinary(postForm);
            }
            else {
                xhq.send(postForm);
            }
        },
        cancelUpload: function (isTriggerErrorEvent) {
            var self = this,
                isTriggerErrorEvent = arguments.length === 2 ? arguments[1] : isTriggerErrorEvent;

            self._cache = [];
            if (isTriggerErrorEvent) {
                self._settings.file_queue_error_handler.call(self, undefined, ERROR.UPLOAD_FILE_CANCELLED);
            }
        },
        setButtonDisabled: function (disable) {
            var self = this,
                action = disable ? "addClass" : "removeClass";

            if (!self._cache.busy) {
                self._disabled = disable;
                self._container.disabled = disable ? disable : EMPTY;
                $(self._container.parentNode)[action]("btn_file_disable");
            }
            return self;
        }
    };

})(window, Zepto);
