/**
 * Created by jian_chen on 2015/2/26.
 */
define(['dInherit'], function(dInherit){
    var JsLog = {
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
        };

    JsLog.Level = {
        DEBUG: 'debug',
        ERROR: 'error',
        LOG: 'log',
        INFO: 'info',
        WARN: 'warn'
    };

    JsLog.LogEntity = dInherit({
        initialize: function(categoryName, level, message){
            this.startTime = new Date();
            this.categoryName = categoryName || 'Default';
            this.level = level || JsLog.Level.LOG;
            this.message = message;
        }
    });

    /**
     * core class
     * 输出log 信息
     */
    JsLog.Logger = dInherit({
        initialize: function(name){
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
        },
        addAdapter: function(adapter)   {
            if(adapter instanceof JsLog.Adapter) {
                adapter.setLogger(this);
                this.adapters.push(adapter);
            }

            return this;
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

            return this;
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
    });

    /**
     * Loger ui/console adapter
     */
    JsLog.AbstractAdapter = dInherit({
        setLogger: function(logger){
            this.logger = logger;
        },
        dispatch: function(){},
        initialize: function(){
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
    });

    return JsLog;
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

