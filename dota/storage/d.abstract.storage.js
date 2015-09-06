define(['dInherit', 'dValidate', 'dDate'], function(dInherit, dValidate, dDate){
    var AbstractStorage = dInherit({
        __propertys__: function(){
            this.proxy = null;

            this.proxyManagerKey = '_STORAGE_MANAGER';
        },
        initialize: function () {

        },
        set: function(key, value, expir){
            if(!key || dValidate.isNull(value)) return;

            var lastModifyDate = new dDate().toString();
            // 默认保存7天
            expir = expir ? new dDate(expir) : new dDate().addDay(7);

            this._setManagerCache(key, expir);
            try{
                this.proxy.setItem(key, JSON.stringify({
                    value: value,
                    lastModifyDate: lastModifyDate
                }));
            }
            catch(e){
                if(e.name === 'QuotaExceededError'){
                    this.set(key, value, expir);
                }
            }
        },
        get: function(key){
            if(!key) return;

            var expir = this._getManagerCache(key),
                result = null;

            if(expir) {
                try {
                    result = JSON.parse(this.proxy.getItem(key)).value;
                } catch (e){}
            } else {
                this.remove(key);
            }

           return result;
        },
        remove: function(key){
            if(!key) return;

            this.proxy.removeItem(key);
        },
        clearAll: function(){
            this.proxy.clear();
        },
        /**
         * 获取过期日期
         * @param key
         * @returns {*}
         */
        getExpireTime: function(key){
            return this._getManagerCache(key)['lastModifyDate'];
        },
        /**
         * 获取上一次修改时间
         * @param key
         * @returns {*}
         */
        getLastModifyDate: function(key){
            return this.get(key)['lastModifyDate'];
        },
        /**
         * 保存storage的过期信息
         * @param key
         * @param timeout
         * @private
         */
        _setManagerCache: function(key, timeout){
            if (!key || !timeout || dDate.parse(timeout).date < new Date()) return;

            var currentObj = this.proxy.getItem(this.proxyManagerKey);

            currentObj = currentObj ? JSON.parse(currentObj) : {};
            currentObj[key] = dDate.parse(timeout).getTime();
            try {
                this.proxy.setItem(this.proxyManagerKey, JSON.stringify(currentObj));
            } catch(e){
                if(e.name === 'QuotaExceededError'){
                    this._setManagerCache(key, timeout);
                }
            }
        },
        /**
         * 获取storage的过期信息
         * 无信息， 已过期则返回null
         * @param key
         * @private
         */
        _getManagerCache: function(key){
            if(!key || !dValidate.isString(key)) return;

            var currentObj = this.proxy.getItem(this.proxyManagerKey),
                now,
                timeout;

            currentObj = currentObj ? JSON.parse(currentObj) : {};
            timeout = currentObj[key];

            // 如果timeout已过期则删除此条记录
            if(!dValidate.isNull(timeout)){
                timeout = dDate.parse(timeout).getTime();
                now = new Date().getTime();

                if(timeout <= now) {
                    timeout = null;
                }
            } else {
                timeout = null;
            }

            if(dValidate.isNull(timeout)){
                this._removeManagerCache(key);
            }

            return timeout;
        },
        /**
         * 删除storage的过期信息
         * @param key
         * @private
         */
        _removeManagerCache: function(key){
            if(!key || !dValidate.isString(key)) return;

            var currentObj = this.proxy.getItem(this.proxyManagerKey);
            currentObj = currentObj ? JSON.parse(currentObj) : {};

            if(currentObj[key]){
                // 置空, 不使用delete, 因为
                currentObj[key] = null;
                this.proxy.setItem(this.proxyManagerKey, JSON.stringify(currentObj));
            }
        }
    });

    return AbstractStorage;
});