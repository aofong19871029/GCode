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

            this.eventQueue = [];
        },

        initialize: function(){
            this._id = config.prefix +  new Date().getTime();
        },

        getUniqueId: function(){ return this._id;},

        setOptions: function(options){
            var self = this;

            this.opt = options || {};

            try {
                this.$el = $(this.tplFunc(this.opt)).css({
                        'z-index': config.getBiggerZindex(),
                        'display': 'none'
                    });

                $.each(this.eventQueue, function(i, item){
                    self.bindEvent(item.type, item.selector, item.handler);
                });
            }
            catch(e){
                this.$el = $();
            }
            finally {
                this.eventQueue = [];
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
            }

            if(!isFunction(handler)) return;

            if(!this.$el){
                this.eventQueue.push({type: type, selector: selector, handle: $.proxy(handler, this)});
            } else {
                this.$el.on(type, selector, handler);
            }
        },

        destory: function(){
            this.$el.off();
            this.$el.remove();
            this.eventQueue = undefined;
        }
    });

    return BaseUI;
});