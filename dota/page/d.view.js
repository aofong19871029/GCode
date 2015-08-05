define(['dStore', 'dGuid', 'dValidate'], function(dStore, dGuid, dValidate){
    var BaseView = Backbone.View.extend({
        __propertys__: function(){
        },

        initialize: function(){},

        create: function(options){
            dValidate.isFunction(this.onCreate) && this.onCreate();
        },

        load: function(options){
            dValidate.isFunction(this.onLoad) && this.onLoad();
        },

        hide: function(options){
            Validate.isFunction(this.onHide) && this.onHide();
        },

        forward: function(){},

        back: function(){

        }

    });

    return BaseView;
});