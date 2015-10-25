define(['dInherit', 'dCompare', 'dValidate', 'dUIQueue'], function(dInherit, dCompare, dValidate, dUIQueue) {
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

            this._hasChange;
        },

        initialize: function(){
            this._id = config.prefix +  new Date().getTime();

            this._eventQueue = [];
        },

        getUniqueId: function(){ return this._id;},

        /**
         * 参数设置函数
         * 比较options 与 this.opt 如果不一样则删除原dom, 重新render, 如果一样就什么都不做
         * 不可被子类重写
         *
         * 1. 设置参数
         * 2. 根据参数整合模板数据
         * 3. 模板+数据=>html , $el
         * @param options
         */
        setOptions: function(options){
            var self = this,
                el = this.$el;

            this._hasChange = !dCompare(this.opt , options);

            this.opt = options || {};

            try {
                if(this._hasChange || !this.$el || !this.$el.length) {
                    this.$el = $(this.tplFunc(this.opt));
                } else {
                    this.$el.html($(this.tplFunc(this.opt)).html());
                }


                this.$el.css({
                    'z-index': config.getBiggerZindex(),
                    'display': 'none'
                });

                if(this._name.indexOf(['Header', 'Switch', 'numberStep']) !== -1) {
                    dUIQueue.add(this);
                }

                // 初始化events
                this.initEvents();

                // 注册事件
                $.each(this._eventQueue, function (i, item) {
                    self.bindEvent(item.type, item.selector, item.handler);
                });
            }
            catch(e){
                Ancients.syslog.error(e.stack);

                this.$el = $();
            }
            finally {
                // opt变化则删除前dom 重新渲染UI
                el && el.remove && dValidate.isFunction(el.remove) && el.remove();
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
                this._eventQueue.push({type: type, selector: selector, handler: $.proxy(handler, this)});
            } else {
                selector ? this.$el.off(type, selector, handler).on(type, selector, handler) : this.$el.off(type, handler).on(type, handler);
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
                spaceIdx;

            if(this.hasProperty('events')) {
                for (var i in this.events) {
                    i = i.trim();
                    // key为空无效
                    if (dValidate.isEmptyStr(i) || i.trim() === '__propertys__') continue;

                    spaceIdx = i.indexOf(' ');

                    // $el 绑定事件
                    if (spaceIdx == -1) {
                        type = i;
                        selector = null;
                    }
                    // 委托绑定
                    else{
                        type = i.slice(0, spaceIdx);
                        selector = i.slice(spaceIdx + 1).trim();
                    }

                    handler = this.events[i];
                    if (dValidate.isString(handler)) {
                        handler = this[handler];
                    }

                    // 找不到handler 无效
                    if (!dValidate.isFunction(handler)) continue;

                    this._eventQueue.push({type: type, selector: selector, handler: $.proxy(handler, this)});
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