/**
 * LocalStorage的简易入口
 */

define(['dInherit', 'dLocalStorage', 'dAbstractStorage', 'dDate', 'dLog', 'dValidate'], function(dInherit, dLocalStorage, dAbstractStorage, dDate, dLog, dValidate){
    var Message = {
        ERROR_OPTIONS: 'error Store option',
        ERROR_KEY: 'error Store key',
        ERROR_EXPIR: 'error Store expir'
    };

    var Store = dInherit(dAbstractStorage, {
        __propertys__: function(){
            // store key
            this.key = '';

            // now
            this._now = new dDate();

            // life time
            this.expir =  '7D';

            // 代理storage
            this.iProxy = dLocalStorage.getInstance();

            this.error = $.proxy(dLog.defaultLog.error, dLog.defaultLog);

            // 存储数据
            this._model = {};
        },
        initialize: function(options){
            if(this._checkOpt(options)) {
                $.extend(this, options);

                this.expir = this._getExpirDate();
            }
        },
        /**
         * 验证参数是有效性
         * @param options
         * @returns {boolean}
         * @private
         */
        _checkOpt: function(options){
            var result = true;

            if(!dValidate.isObject(options)){
                this.error(Message.ERROR_OPTIONS);
                result = false;
            } else if(!dValidate.isString(options.key) || options.key.length === 0) {
                this.error(Message.ERROR_KEY);
                result = false;
            } else if(!dValidate.isString(options.expir) || options.expir.length === 0) {
                this.error(Message.ERROR_EXPIR);
                result = false;
            }

            return result;
        },
        /**
         * 将expir 转化为具体的时间
         * @private
         */
        _getExpirDate: function(){
            var expir = this.expir,
                now = this._now,
                splitIdx = expir.length - 1,
                unit = expir.charAt(splitIdx).toUpperCase(),
                val = parseInt(expir.substring(0, splitIdx), 10),
                date;

            switch (unit){
                case 'D':
                    date = now.addDay(val) ;
                    break;
                case 'M':
                    date = now.addMonth(val) ;
                    break;
                case 'H':
                    date = now.addHours(val) ;
                    break;
                case 'I':
                    date = now.addMinutes(val) ;
                    break;
                default :
                    date = now.addDay(7);
                    break;
            }

            return date;
        },
        set: function(value){
            this.iProxy.set(this.key, JSON.stringify(value), this.expir.getTime());
        },
        setAttr: function(name, value){
            if(!dValidate.isString(name)) return;

            var data = this.get();

            if(!data) {
                data = {};
            }
            data[name + ''] = value;
            this.set(data);
        },
        get: function(){
            return JSON.parse(this.iProxy.get(this.key));
        },
        getAttr: function(name){
            var data = this.get();

            return data ? data[name] : null;
        }
    });

    return Store;
});