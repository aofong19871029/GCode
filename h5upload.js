/**
 * h5 update
 */


;
(function (WIN, $, undefined) {
    "use strict";

    var EMPTY = "",
        NOOP = function () {
        },

        isCanvasSupported = function () {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        },
        getFunction = function (fn) {
            return $.isFunction(fn) ? fn : NOOP;
        },
        optionsValidate = function (opt) {
            var container = opt.container,
                size = opt.size.toUpperCase().split(' '),
                compress = opt.compress;

            if (!container)  throw ERROR.ARGUMENTS_EXCEPTION;
            if (!$.isNumeric(size[0])) throw ERROR.ARGUMENTS_EXCEPTION;
            if(compress && compress.enable){
                 if(isNaN(compress.width) || isNaN(compress.height)) throw ERROR.ARGUMENTS_EXCEPTION;
            }
            if(size.length > 1){
                 switch (size[1]){
                     case 'MB':
                         size = size * 1024 * 1024;
                         break;
                     case 'KB':
                         size = size * 1024;
                         break;
                 }
            }

            return $.extend(true, opt, {
                size: size
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
            FILE_EXCEEDS_SIZE_LIMIT: {code: -100, msg: '文件大小超过限定尺寸'},
            UPLOAD_FILE_CANCELLED: {code: -120, msg: '文件上传被取消'},
            ARGUMENTS_EXCEPTION: {code: -130, msg: '参数异常' }
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
                onProgress: NOOP,
                onBeforeUpload: NOOP
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

        self.__initalize();
    }

    H5Upload.prototype = {
        constructor: H5Upload,
        __initalize: function(){
            var self = this;

        }
    };

})(window, Zepto);
