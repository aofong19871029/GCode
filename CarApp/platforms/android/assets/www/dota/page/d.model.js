define(['dStore', 'dGuid', 'dAjax'], function(dStore, dGuid, dAjax){
    var BaseModel = Backbone.Model.extend({
        __propertys__: function(){
            this.store = new dStore({
                key: dGuid.newGuid(),
                expir: '30I'
            });
        },

        initialize: function(controller){
            this.controller = controller;
        },

        /**
         * 封装ajax
         * @param options
         */
        request: function(options){
            dAjax.post(options.url, options.success, options.error, options.store);
        }

    });

    return BaseModel;
});