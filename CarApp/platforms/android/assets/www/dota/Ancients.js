(function(doc, exports) {
    var url = location.href,
        rootIdx = url.indexOf('/www/'),
        Ancients;

    Ancients = {
        isH5: rootIdx === -1,
        isApp: rootIdx !== -1,
        init: false,
        dir: rootIdx === -1 ? '/' : url.slice(0, rootIdx + 5),
        frameworkDir: 'dota/',
        serviceDir: 'http://localhost/restful/',
        // 开启view切换 和 部分UI组件的动画效果
        animation: true,
        isFunction: function (func) {
            if (typeof func === 'undefined') return false;

            return Array.prototype.toString.call(func) === '[object Function]';
        },

        loadJs: function (url, callback) {
            var isCallbackFunc = this.isFunction(callback);
            script = doc.createElement("script");

            script.type = "text/javascript";
            script.src = url;

            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                        script.onreadystatechange = null;
                        isCallbackFunc && callback();
                    }
                };
            } else { //Others: Firefox, Safari, Chrome, and Opera
                script.onload = function () {
                    isCallbackFunc && callback();
                };
            }

            doc.body.appendChild(script);
        },

        config: function (options) {
            if (options.dir && typeof options.dir === 'string') {
                this.dir = options.dir;
            }

            if (options.serviceDir && typeof options.serviceDir === 'string') {
                this.serviceDir = options.serviceDir;
            }
        },

        cssPath: function (relative) {
            return 'css!' + Ancients.dir + relative;
        }
    };

    var scripts = document.querySelectorAll('script'),
        tmp,
        pageConfigUrl;

    for (var i = 0; i < scripts.length; i++) {
        tmp = scripts[i].getAttribute('pgConfig');
        if (tmp && tmp.length) {
            pageConfigUrl = tmp;
            break;
        }
    }



    Ancients.loadJs(Ancients.dir + Ancients.frameworkDir + 'external/require.min.js', function () {

        Ancients.loadJs(Ancients.dir + Ancients.frameworkDir + 'config.js');
    });

    exports.Ancients = Ancients;
})(document, window);