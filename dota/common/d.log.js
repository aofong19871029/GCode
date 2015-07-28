/**
 * Created by jian_chen on 2015/2/26.
 */
define(['dInherit'], function(){
    var win = window,
        // inhert class core
        inhert = function extend(subClass,superClass, protot) {
            var F = function () {};
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            if(protot){
                util.mix(subClass.prototype, protot, true);
            }
            if(superClass.prototype.constructor == Object.prototype.constructor){
                superClass.prototype.constructor = superClass;
            }
        },
        JsLog = {
            version: '1.0',
            applicationStartDate: new Date(),
            loggers: {},
            clear: function(categoryName){
                if(typeof categoryName === 'string' && categoryName.length !== 0){
                    delete this.loggers[categoryName];
                }
                if(categoryName == undefined){
                    this.loggers = {};
                }
            },
            save: function () {},
            getLogger: function (categoryName) {
                return typeof categoryName === 'string' ? this.loggers[categoryName] : [];
            }
        },
        util = {
            // time format from log4js
            formatDate: function (vDate, vFormat) {
                var DEFAULT_DATE_FORMAT = "yyyy-MM-ddThh:mm:ssO",
                    /**
                     * Formates the TimeOffest
                     * Thanks to http://www.svendtofte.com/code/date_format/
                     * From https://github.com/stritti/log4js/blob/master/log4js/src/main/js/log4js.js
                     * @private
                     */
                    O = function (date) {
                        // Difference to Greenwich time (GMT) in hours
                        var os = Math.abs(date.getTimezoneOffset());
                        var h = String(Math.floor(os / 60));
                        var m = String(os % 60);
                        h.length == 1 ? h = "0" + h : 1;
                        m.length == 1 ? m = "0" + m : 1;
                        return date.getTimezoneOffset() < 0 ? "+" + h + m : "-" + h + m;
                    },
                    /**
                     * From https://github.com/stritti/log4js/blob/master/log4js/src/main/js/log4js.js
                     */
                    addZero = function (vNumber) {
                        return ((vNumber < 10) ? "0" : "") + vNumber;
                    }

                if (typeof vFormat !== 'string') vFormat = DEFAULT_DATE_FORMAT;

                var vDay = addZero(vDate.getDate());
                var vMonth = addZero(vDate.getMonth() + 1);
                var vYearLong = addZero(vDate.getFullYear());
                var vYearShort = addZero(vDate.getFullYear().toString().substring(3, 4));
                var vYear = (vFormat.indexOf("yyyy") > -1 ? vYearLong : vYearShort);
                var vHour = addZero(vDate.getHours());
                var vMinute = addZero(vDate.getMinutes());
                var vSecond = addZero(vDate.getSeconds());
                var vTimeZone = O(vDate);
                var vDateString = vFormat.replace(/dd/g, vDay).replace(/MM/g, vMonth).replace(/y{1,4}/g, vYear);
                vDateString = vDateString.replace(/hh/g, vHour).replace(/mm/g, vMinute).replace(/ss/g, vSecond);
                vDateString = vDateString.replace(/O/g, vTimeZone);
                return vDateString;
            },
            addStyle: function(css){
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
            },
            htmlToDom: function(html) {
                var div = win ? win.document.createElement('div') : document.createElement('div'),
                    fragment = document.createDocumentFragment();

                div.innerHTML = html;
                var children = div.children;

                if (children.length > 1) {
                    while (children.length > 0) {
                        fragment.appendChild(children[0]);
                    }
                    return fragment;
                } else {
                    return children[0];
                }
            },
            /**
             * copy all properties in the supplier to the receiver
             * from biz
             * @param r {Object} receiver
             * @param s {Object} supplier
             * @param or {boolean=} whether override the existing property in the receiver
             * @param cl {(Array.<string>)=} copy list, an array of selected properties
             */
            mix: function(r, s, or, cl) {
                if (!s || !r) return r;
                var i = 0, c, len;
                or = or || or === undefined;

                if (cl && (len = cl.length)) {
                    for (; i < len; i++) {
                        c = cl[i];
                        if ((c in s) && (or || !(c in r))) {
                            r[c] = s[c];
                        }
                    }
                } else {
                    for (c in s) {
                        if (or || !(c in r)) {
                            r[c] = s[c];
                        }
                    }
                }
                return r;
            }
        };

    JsLog.Level = {
        DEBUG: 'debug',
        ERROR: 'error',
        LOG: 'log',
        INFO: 'info',
        WARN: 'warn'
    };

    JsLog.LogEntity = function(categoryName, level, message){
        this.startTime = new Date();
        this.categoryName = categoryName || 'Default';
        this.level = level || JsLog.Level.LOG;
        this.message = message;
    };

    JsLog.Logger = function(name){
        var self = this;

        self.name = name || '';
        self.adapters = [];

        // 动态扩展error, debug, warn, info
        for(var i in JsLog.Level){
            (function(x) {
                if (JsLog.Level[x] !== JsLog.Level.LOG) {
                    self[JsLog.Level[x]] = function (message, categoryName) {
                        self.log(message, JsLog.Level[x], categoryName);
                    }
                }
            })(i);
        }
    };
    JsLog.Logger.prototype = {
        addAdapter: function(adapter)   {
            if(adapter instanceof JsLog.Adapter) {
                adapter.setLogger(this);
                this.adapters.push(adapter);
            }
        },
        removeAdapter: function(idxOrClass){
            var type = (typeof idxOrClass).toUpperCase();

            type === 'NUMBER' && this.adapters.splice(idxOrClass, 1);

            if(type === 'FUNCTION'){
                for(var i = 0;i<this.adapters.length; ){
                    if(this.adapters[i] instanceof JsLog.Adapter && this.adapters[i] instanceof idxOrClass){
                        this.adapters.splice(i, 1);
                    }
                    else{
                        i++;
                    }
                }
            }
        },
        log: function(message, level, categoryName){
            var self = this,
                entity = new JsLog.LogEntity(categoryName, level, message);

            self.setToLoggers(categoryName, entity);
            for(var i = 0, l = self.adapters.length; i<l;i++){
                self.adapters[i].dispatch(entity);
            }
        },
        /**
         * 保存log info到全局对象
         * @param categoryName
         * @param entity
         */
        setToLoggers: function(categoryName, entity){
            if(!JsLog.loggers[categoryName]){
                JsLog.loggers[categoryName] = [];
            }
            if(entity instanceof JsLog.LogEntity) {
                JsLog.loggers[categoryName].push(entity);
            }
        }
    };

    JsLog.Adapter = function(){}
    JsLog.Adapter.prototype = {
        setLogger: function(logger){
            this.logger = logger;
        },
        dispatch: function(){},
        init: function(){
            this.on();
        },
        on: function(){
            this._status = 1;
        },
        off: function(){
            this._status = 0;
        },
        isOff: function(){
            return this._status == 0;
        }
    };

    JsLog.ConsoleAdapter = function(){
        this.init(); // inhert function
    };
    inhert(JsLog.ConsoleAdapter, JsLog.Adapter, {
        /**
         * 输出log提示
         * @param entity
         */
        dispatch: function(entity){
            if(this.isOff() || win.console == undefined) return;
            var msg = '[' + entity.level.toUpperCase() + ']' + util.formatDate(entity.startTime) + '     ' + entity.message;
            win.console[entity.level](msg);
        }
    });

    JsLog.UIAdapter = function(){
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

        this.dom = util.htmlToDom(this.tpl);
        util.addStyle(this.style);
        this.hide();
        win.document.body.appendChild(this.dom);
        this.bindEvents();

        this.init(); // inhert function
    };
    inhert(JsLog.UIAdapter, JsLog.Adapter, {
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

            var msg = '[' + entity.level.toUpperCase() + ']' + util.formatDate(entity.startTime) + '     ' + entity.message,
                ul = this.dom.children[this.dom.children.length - 1].children[0];

            ul.appendChild(util.htmlToDom('<li class="' + entity.level.toLowerCase() + '">' + msg + '</li>'));
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
        }
    });

    win.JsLog = JsLog;
});


//(function(){
//    /**
//     * test code
//     */
//
//    var l = new JsLog.Logger('test');
//    var ad = new JsLog.ConsoleAdapter();
//    var uad = new JsLog.UIAdapter();
//    l.addAdapter(ad);
//    l.addAdapter(uad);
//    l.log('jgkfglfjlgf', JsLog.Level.WARN, 'GGF');
//    l.log('this is a long str to test log function. [LOG]2015-02-28T15:55:49+0800     fdfdjlk jlk jgfj lkj kl jk jglfj l jljlrere JsLog.UIAdapter {tpl:                 …               , ".J_infoLogAdapter{background: #fff;z-index: 9999;b…            .J_infoLogAdapter ul{list-style:none}", dom: div.J_infoLogAdapter, _status: 1, logger: JsLog.Logger…}');
//    window.l = l;
//})();

/**
 * 1. 单例log
 * 2. info, debug 分开
 * 3. resize UI adapter
 * 4. json config instead of programing
 * 5. define
 */

