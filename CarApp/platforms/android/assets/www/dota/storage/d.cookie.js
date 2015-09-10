define(['dInherit', 'dAbstractStorage'], function(dInherit, dAbstractStorage){
    var CookieStorage = dInherit(dAbstractStorage, {
        __propertys__: function(){
            this.proxy = document.cookie;
        },
        get: function(key){
            var cookieArray = this.proxy.split(';'),
                result = '',
                tmpCookie;

            $.each(cookieArray, function(i, item){
                tmpCookie = item.split('=');
                if(tmpCookie[0] === key) {
                    result = decodeURIComponent(tmpCookie[1]);
                    return false;
                }
            });

            return result;
        },
        /**
         * 写入cookie
         * @param {String} key cookie 名称
         * @param {String|Object} value 可以为字符串或者json对象
         * @param {Date} [timeout=Session] 有效期
         * @param {String} [path=/] 路径
         * @param {String} [domain] 域名,默认为当前域名
         * @param {boolean} [secure=false] 安全级别
         */
        set: function (key, value, timeout, path, domain, secure) {
            value = _.isObject(value) ? JSON.stringify(value) : value;
            document.cookie = key + "=" + encodeURIComponent(value) +
                ((timeout) ? "; expires=" + timeout : "") +
                ((path) ? "; path=" + path : "") +
                ((domain) ? "; domain=" + domain : "") +
                ((secure) ? "; secure" : "");
        },
        remove: function(key) {
            document.cookie = key + "=" +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-1970 00:00:01 GMT";
        },
        getExpireTime: function(){},
        clear: function(){}
    });

    CookieStorage.getInstance = function () {
        if (this.instance) {
            return this.instance;
        } else {
            return this.instance = new this();
        }
    };

    return CookieStorage;
});