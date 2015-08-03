(function(win, doc){
    win.Ancients = {
        dir: '',
        isFunction: function(func){
            return Array.prototype.toString.call(func) === '[object Function]';
        },

        loadJs : function(url, callback){
            var isCallbackFunc = this.isFunction(callback),
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
        }
    };

    Ancients.loadJs('/common/require.min.js', function(){
        Ancients.loadJs('config.js');
    });
})(window, document);