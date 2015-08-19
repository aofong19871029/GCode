(function(win, doc){
    win.Ancients = {
        init: false,
        dir: '/www/dota/',
        serviceDir: 'http://localhost/restful/',
        isFunction: function(func){
            if(typeof func === 'undefined') return false;

            return Array.prototype.toString.call(func) === '[object Function]';
        },

        loadJs : function(url, callback){
            var isCallbackFunc = this.isFunction(callback);
                script = doc.createElement("script");

            script.type = "text/javascript";
            script.src = url;

            if (script.readyState){ //IE
                script.onreadystatechange = function(){
                    if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                        script.onreadystatechange = null;
                        isCallbackFunc && callback();
                    }
                };
            } else { //Others: Firefox, Safari, Chrome, and Opera
                script.onload = function(){
                    isCallbackFunc && callback();
                };
            }

            doc.body.appendChild(script);
        },

        config: function(options){
            if(options.dir && typeof options.dir === 'string') {
                this.dir = options.dir;
            }

            if(options.serviceDir && typeof options.serviceDir === 'string') {
                this.dir = options.serviceDir;
            }
        }
    };

    var scripts = document.querySelectorAll('script'),
        tmp,
        pageConfigUrl;

    for(var i = 0; i< scripts.length; i++){
        tmp = scripts[i].getAttribute('pgConfig');
        if(tmp && tmp.length){
            pageConfigUrl = tmp;
            break;
        }
    }

    Ancients.loadJs(Ancients.dir + '/external/require.min.js', function(){
        Ancients.loadJs(Ancients.dir + 'config.js', function(){
            pageConfigUrl && Ancients.loadJs(pageConfigUrl);
        });
    });
})(window, document);