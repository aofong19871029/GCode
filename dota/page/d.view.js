define(['dStore', 'dGuid'], function(dStore, dGuid){
    var BaseView = Backbone.View.extend({
        __propertys__: function(){
        },

        initialize: function(){},

        create: function(options){
            this.onCreate();
        },

        load: function(options){
            this.onLoad();
        },

        hide: function(options){
            this.onHide();
        },

        forward: function(){},

        back: function(){

        }

    });

    return Model;
});