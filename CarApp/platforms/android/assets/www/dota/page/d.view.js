define(['dStore', 'dGuid', 'dValidate', 'dUIHeader', 'dUIToast'], function(dStore, dGuid, dValidate, dUIHeader, dUIToast){
    var BaseView = Backbone.View.extend({
        __propertys__: function(){
            // 蓝色头部
            this.header;
        },

        initialize: function(opt){
            this.controller = opt.controller;

            dValidate.isFunction(this.init) && this.init();
        },

        create: function(options){
            dValidate.isFunction(this.onCreate) && this.onCreate();
        },

        load: function(options){
            //用于切换页面时，让当前input失去焦点
            document.body && (document.body.tabIndex = 10000);
            this.stickit();

            dValidate.isFunction(this.onLoad) && this.onLoad();
            this.$el.show();
        },

        show: function(){
            dValidate.isFunction(this.onShow) && this.onShow();
        },

        hide: function(options){
            dValidate.isFunction(this.onHide) && this.onHide();
            this.$el.hide();
        },

        forward: function(){},

        back: function(){

        },

        /**
         * 矫正$el
         * @param el
         * @private
         */
        _setRootEl: function(el){
            this.$el = el;
            this.el = el[0];
            this._ensureElement();
        },

        /**
         * 嵌入头部
         * @param opt
         *
         * {
         *    titleHtml: 中间文字
         *    back: true
         *    moreHtml: 右侧文字
         *    listener: {
         *      backHandler:
         *      moreHandler:
         *      'selector': 'handler
         *    }
         * }
         */
        embedHeader: function(opt){
            if(!this.header){
                this.header = new dUIHeader(this.$el);
            }

            this.header.setOpt(opt);

            this.header.show();
        },

        showToast: function(message){
            if(!this.toast){
                this.toast = new dUIToast(this.$el);
            }

            this.toast.setOpt({
                message: message
            });

            this.toast.show();
        }

    });

    return BaseView;
});