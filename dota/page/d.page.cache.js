define(['dInherit', 'dHash'], function(dInherit, dHash){
    var PageCache = dInherit({
        __propertys__: function(){
            // 缓存page
            this._cache = new dHash();
            // view的顺序
            this._queueCaches = [];
            // view顺序数组
            this._history = [];
        },
        initialize: function(){

        },
        /**
         * 向前进一页
         * 进栈
         * @param name 页面名
         * @param path 页面路径
         * @param page  页面controller 实例
         */
        forward: function(name, path, page){
            if(this._isCurrentPage(name)) return;

            this._cache.add(name, page);
            this._queueCaches.push({
                name: name,
                page: page,
                path: path
            });
            this._history.push(name);
        },
        /**
         * 后退到某页
         * 出栈
         *
         * 如果没有历史则forward(这种情况是错误的使用back)
         */
        back: function(name, path, page){
            if(this._isCurrentPage(name)) return;

            var lastIdx = _.lastIndexOf(this._history.slice(1 - this._history.length), name);

            if(lastIdx === -1 ) {
                this.forward(name, page);
            } else {
                while (lastIdx < this._history.length - 1) {
                    this._history.pop();
                    this._queueCaches.pop();
                }
            }
        },
        _isCurrentPage: function(name){
            return _.lastIndexOf(this._history, name) === this._history.length - 1;
        },
        getPage: function(name) {
            return this._cache.find(name);
        },
        getPagePath: function(name){
            var obj = _.findWhere_(this._queueCaches, {name: name});
            return obj ? obj.path : obj;
        },
        length: function(){
            return this._queueCaches.length;
        }
    });

    return PageCache;
});