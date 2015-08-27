define(['dStore', 'dAjax', 'dValidate'], function(dStore, dAjax, dValidate){
    var BaseModel = Backbone.Model.extend({
        __propertys__: function(){

        },

        initialize: function(controller, storeName){
            this.controller = controller;

            if(dValidate.isString(storeName)){
                this.store = new dStore({
                    key: storeName,
                    expir: '30I'
                });
            }

            dValidate.isFunction(this.init) && this.init();
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