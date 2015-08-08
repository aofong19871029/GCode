define(['dStore', 'dGuid', 'dValidate'], function(dStore, dGuid, dValidate){
    var BaseView = Backbone.View.extend({
        __propertys__: function(){
        },

        initialize: function(){
            dValidate.isFunction(this.init) && this.init();
        },

        create: function(options){
            dValidate.isFunction(this.onCreate) && this.onCreate();

//            this.delegateEvents();
        },

        load: function(options){
            dValidate.isFunction(this.onLoad) && this.onLoad();

//            this.delegateEvents();
        },

        hide: function(options){
            dValidate.isFunction(this.onHide) && this.onHide();

//            this.undelegateEvents();
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
        }

    });

    return BaseView;
});