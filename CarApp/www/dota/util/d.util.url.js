/**
 * url 解析函数
 */

define(function(){
    return {
        /**
         * 解析URL中的各项参数
         * @method Util.cUtilPath.parseUrl
         * @param url
         * @returns {{href: (*|string), hrefNoHash: (*|string), hrefNoSearch: (*|string), domain: (*|string), protocol: (*|string), doubleSlash: (*|string), authority: (*|string), username: (*|string), password: (*|string), host: (*|string), hostname: (*|string), port: (*|string), pathname: (*|string), directory: (*|string), filename: (*|string), search: (*|string), hash: (*|string)}}
         */
        parseUrl: function (url) {
            var urlParseRE = /^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/;
            var matches = urlParseRE.exec(url || "") || [];

            return {
                href: matches[0] || "",
                hrefNoHash: matches[1] || "",
                hrefNoSearch: matches[2] || "",
                domain: matches[3] || "",
                protocol: matches[4] || "",
                doubleSlash: matches[5] || "",
                authority: matches[6] || "",
                username: matches[8] || "",
                password: matches[9] || "",
                host: matches[10] || "",
                hostname: matches[11] || "",
                port: matches[12] || "",
                pathname: matches[13] || "",
                directory: matches[14] || "",
                filename: matches[15] || "",
                search: matches[16] || "",
                hash: matches[17] || ""
            };
        },

        /**
         * 截取URL参数
         * @method Util.cUtilPath.getUrlParam
         * @param {url} url
         * @param {String} key 参数key名
         * @returns {String} value 参数值
         */
        getUrlParam : function (url, name) {
            var re = new RegExp("(\\?|&)" + name + "=([^&]+)(&|$)", "i"), m = url.match(re);
            return m ? m[2] : "";
        },

        /**
         * 解析URL参数为json对象
         * @method Util.cUtilPath.getUrlParams
         * @static
         * @param {url} url
         * @returns {Json} object
         */
        getUrlParams : function (url) {
            var _url = url.split('://');
            var searchReg = /([^&=?]+)=([^&]+)/g;
            var urlParams = {};
            var match, value, length, name;

            while (match = searchReg.exec(_url[0])) {
                name = match[1];
                value = match[2];
                urlParams[name] = value;
            }

            if (_url[1]) {
                var idx = 0;
                length = _.size(urlParams);
                _.each(urlParams, function (value, key) {
                    if (++idx == length) {
                        urlParams[key] += '://' + _url[1];
                    }
                });
            }

            return urlParams;
        },

        /**
         * 设置url参数
         * @param url
         * @param params
         * @returns {*} url + search + hash
         */
        setParams: function(url, params){
            if(!params) return url;

            var currentParams = this.getUrlParams(url),
                urlObj = this.parseUrl(url),
                mergeParams;

            $.extend(true, currentParams, params);
            mergeParams = $.param(currentParams);

            return urlObj.hrefNoSearch + (mergeParams ? '?' + mergeParams : '') + urlObj.hash;
        }
    };
});