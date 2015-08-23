define(['dInherit', 'dValidate'], function(dInherit, dValidate) {
    var config = {
            prefix: 'ui-',
            /**
             * 获取递增的zindex
             */
            getBiggerZindex: (function () {
                var diviso = 3000;
                return function () {
                    return ++diviso;
                };
            })()
        },
        isFunction = dValidate.isFunction,
        BaseUI;

    BaseUI = dInherit({
        __propertys__: function () {
            // 唯一标识符
            this._id;

            this.opt;

            this.tplFunc;

            this.$el;

            this.animation = Ancients.animation;

            this._eventQueue = [];
        },

        events: {},

        initialize: function(){
            this._id = config.prefix +  new Date().getTime();

            this.initEvents();
        },

        getUniqueId: function(){ return this._id;},

        /**
         * 参数设置函数
         *
         * 1. 设置参数
         * 2. 根据参数整合模板数据
         * 3. 模板+数据=>html , $el
         * @param options
         */
        setOptions: function(options){
            var self = this;

            this.opt = options || {};

            try {
                this.$el = $(this.tplFunc(this.opt)).css({
                        'z-index': config.getBiggerZindex(),
                        'display': 'none'
                    });

                $.each(this._eventQueue, function(i, item){
                    self.bindEvent(item.type, item.selector, item.handler);
                });
            }
            catch(e){
                Ancients.syslog.error(e.stack);

                this.$el = $();
            }
            finally {
                this._eventQueue = [];
            }
        },

        show: function(){
            isFunction(this.onShow) && this.onShow();

            this.$el.show();
        },

        hide: function(){
            this.$el.hide();

            isFunction(this.onHide) && this.onHide();
        },

        /**
         * 绑定组件自定义事件
         * 如果在Root El初始化前执行, 则缓存事件参数，延迟至root初始化后再绑定
         *
         * @param type
         * @param selector
         * @param handler
         */
        bindEvent: function(type, selector, handler){
            if(arguments.length === 2) {
                // type, handler
                handler = selector;
                selector = null;
            }

            if(!isFunction(handler)) return;

            if(!this.$el){
                this._eventQueue.push({type: type, selector: selector, handle: $.proxy(handler, this)});
            } else {
                selector ? this.$el.on(type, selector, handler) : this.$el.on(type, handler);
            }
        },

        /**
         * 将events 中注册的事件注入到_eventQueue 中
         * 待dom初始化再绑定
         */
        initEvents: function(){
            var type,
                selector,
                handler,
                tmp;

            if(this.hasOwnProperty('events')) {
                for (var i in this.events) {
                    i = i.trim();
                    // key为空无效
                    if (dValidate.isEmptyStr(i)) continue;

                    tmp = i.split(' ');

                    // $el 绑定事件
                    if (tmp.length === 1) {
                        type = i;
                        selector = null;
                    }
                    // 委托绑定
                    else if (tmp.length === 2) {
                        type = tmp[0];
                        selector = tmp[1]
                    }

                    handler = this.events[i];
                    if (dValidate.isString(handler)) {
                        handler = this[handler];
                    }

                    // 找不到handler 无效
                    if (!dValidate.isFunction(handler)) continue;

                    this._eventQueue.push({type: type, selector: selector, handle: $.proxy(handler, this)});
                }
            }
        },

        destory: function(){
            this.$el.off();
            this.$el.remove();
            this._eventQueue = undefined;
        }
    });

    return BaseUI;
});