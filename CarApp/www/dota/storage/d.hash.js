define(['dInherit'], function(dInherit){
    var HashStorage = dInherit({
        add: function (k, v) {
            if (!this.hasOwnProperty(k)) {
                this[k] = v;
            }
        },
        remove: function (k) {
            if (this.hasOwnProperty(k)) {
                delete this[k];
            }
        },
        update: function (k, v) {
            this[k] = v;
        },
        // 继承方法
        set: function(k, y){
            this.update(k, y);
        },
        // 继承方法
        get: function(k){
            return this.find(k);
        },
        has: function (k) {
            var type = typeof k;
            if (type === 'string' || type === 'number') {
                return this.hasOwnProperty(k);
            } else if (type === 'function' && this.some(k)) {
                return true;
            }
            return false;
        },
        clear: function () {
            for (var k in this) {
                if (this.hasOwnProperty(k)) {
                    delete this[k];
                }
            }
        },
        empty: function () {
            for (var k in this) {
                if (this.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        },
        each: function (fn) {
            for (var k in this) {
                if (this.hasOwnProperty(k)) {
                    fn.call(this, this[k], k, this);
                }
            }
        },
        map: function (fn) {
            var hash = new HashStorage;
            for (var k in this) {
                if (this.hasOwnProperty(k)) {
                    hash.add(k, fn.call(this, this[k], k, this));
                }
            }
            return hash;
        },
        filter: function (fn) {
            var hash = new HashStorage;
            for (var k in this) {
                if (this.hasOwnProperty(k) && fn.call(this, this[k], k, this)) {
                    hash.add(k, this[k]);
                }
            }
            return hash;
        },
        join: function (split) {
            split = split !== undefined ? split : ',';
            var rst = [];
            this.each(function (v) {
                rst.push(v);
            });
            return rst.join(split);
        },
        every: function (fn) {
            for (var k in this) {
                if (this.hasOwnProperty(k)) {
                    if (!fn.call(this, this[k], k, this)) {
                        return false;
                    }
                }
            }
            return true;
        },
        some: function (fn) {
            for (var k in this) {
                if (this.hasOwnProperty(k)) {
                    if (fn.call(this, this[k], k, this)) {
                        return true;
                    }
                }
            }
            return false;
        },
        find: function (k) {
            var type = typeof k;
            if (type === 'string' || type === 'number' && this.has(k)) {
                return this[k];
            } else if (type === 'function') {
                for (var _k in this) {
                    if (this.hasOwnProperty(_k) && k.call(this, this[_k], _k, this)) {
                        return this[_k];
                    }
                }
            }
            return null;
        }
    });

    HashStorage.getInstance = function () {
        if (this.instance) {
            return this.instance;
        } else {
            return this.instance = new this();
        }
    };

    return HashStorage;
});