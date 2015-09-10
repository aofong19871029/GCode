define(['dInherit', 'dBaseLog', 'dDate'], function(dInherit, dBaseLog, dDate){
    var UIAdapter = dInherit(dBaseLog.AbstractAdapter, {
        __propertys__: function(){
            this.tpl = '<div class="J_infoLogAdapter">\
                        <a class="close" href="#">x</a>\
                        <button class="clear">CL</button>\
                        <div class="content">\
                            <ul class="J_tex"></ul>\
                        </div>\
                    </div>';

            this.style = '.J_infoLogAdapter{background: #fff;z-index: 9999;border:1px solid #ddd;padding:20px;line-height:22px;font-family:tahoma,Simsun,sans-serif;color:#333;width:300px;height:500px;position:fixed;bottom:15px;right:10px;text-align:left;cursor: move;}\
                      .J_infoLogAdapter .close{position:absolute;top:5px;right:5px;text-decoration:none;width:15px;height:15px;color:#666;text-align:center;font:bold 16px/20px Simsun;}\
                      .J_infoLogAdapter .content{width:100%;height:100%;word-break:break-all;word-wrap:break-word;overflow:auto;}\
                      .J_infoLogAdapter ul{list-style:none}\
                      .J_infoLogAdapter li{padding-bottom:10px;font-weight: bold}\
                      .debug{color: #27c}\
                      .error{color: #EB3941}\
                      .log{color: #666}\
                      .info{color: #CCCCFF}\
                      .warn{color: #F5BD00}';

            this.wrap = $('body');
        },
        initialize: function(){
            this.__superInitialize.call(this);

            this.dom = $(this.tpl)[0];
            this._addStyle(this.style);
            this.hide();
            this.wrap.append(this.dom);
            this.bindEvents();
        },
        bindEvents: function(){
            var self = this;

            self.dom.children[0].onclick = function(){
                self.hide();
            };

            self.dom.children[1].onclick = function(){
                var ul = self.dom.children[self.dom.children.length - 1].children[0];
                ul.innerHTML = '';
            };
        },
        show: function(){
            this.dom.style.display = '';
        },
        hide: function(){
            this.dom.style.display = 'none';
        },
        off: function(){
            this._status = 0;
            this.hide();
        },
        dispatch: function(entity){
            if(this.isOff()) return;

            var startTime = new dDate(entity.startTime).toString(),
                msg = '[' + entity.level.toUpperCase() + ']' + startTime + '     ' + entity.message,
                ul = this.dom.children[this.dom.children.length - 1].children[0];

            $(ul).append('<li class="' + entity.level.toLowerCase() + '">' + msg + '</li>');
            this.show();
        },
        setStyle: function(styles){
            var container = this.dom,
                containerStyle = container.style,
                i;

            for(i in styles){
                if(containerStyle.hasOwnProperty(i)){
                    containerStyle[i] = styles[i];
                }
            }
        },
        /**
         * add style to head
         * @param css
         * @returns {*}
         * @private
         */
        _addStyle: function(css){
            var style = document.createElement("style");

            style.type= 'text/css';

            if(style.styleSheet) {         //ie下
                style.styleSheet.cssText = css;
            }
            else {
                style.innerHTML = css;       //或者写成 style.appendChild(document.createTextNode(css));
            }

            // Add the <style> element to the page
            // getElementsByTagName('head') to compatible low ie
            document.getElementsByTagName('head')[0].appendChild(style);
            return style.sheet;
        }
    });

    return UIAdapter;
});