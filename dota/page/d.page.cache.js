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
            var lastQueueCache = this._queueCaches.length && this._queueCaches[this._queueCaches.length - 1];


            this._cache.set(name, page);

            // 过滤2次重复的插入, 来保证查询页面顺序的正确性
            if(!lastQueueCache || lastQueueCache.name !== name) {
                this._queueCaches.push({
                    name: name,
                    page: page,
                    path: path
                });
            }
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

            var lastIdx = _.lastIndexOf(this._history.slice(0, this._history.length - 1), name);

            if(lastIdx === -1 ) {
                this.forward(name, page);
            } else {
                while (lastIdx < this._history.length - 1) {
                    this._history.pop();
                    // back 不能删除queueCaches, 因为删除后subview-port的dom就不能重复利用了
                    //this._queueCaches.pop();
                }
            }
        },
        _isCurrentPage: function(name){
            return _.lastIndexOf(this._history, name) === this._history.length - 1 && this._queueCaches.length;
        },
        getPageByViewName: function(name) {
            return this._cache.find(name);
        },
        getPagePathByViewName: function(name){
            var obj = this._searchQueue({name: name});
            return obj ? obj.path : obj;
        },
        getPageByPath: function(path){
            var obj = this._searchQueue({path: path});
            return obj ? obj.page : obj;
        },
        _searchQueue: function(condition){
            return _.findWhere(this._queueCaches, condition);
        },
        length: function(){
            return this._queueCaches.length;
        },
        /**
         * 取上一次的 url
         *
         * 即length -2 的page信息
         * length -1 是当前page
         * @returns {*}
         */
        getLastPageUrl: function(){
            var lastItem = this._queueCaches[this.length() - 2];

            return lastItem ? lastItem['path'] : undefined;
        }
    });

    return PageCache;
});