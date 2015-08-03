define(['dStore', 'dGuid'], function(dStore, dGuid){
    var BaseModel = Backbone.Model.extend({
        __propertys__: function(){
            this.store = new dStore({
                key: dGuid.newGuid(),
                expir: '30I'
            });
        },

        /**
         * 将fetch的数据保存起来
         * @param options
         */
        request: function(options){
            var onsuccess = options.success;

            if(options) {
                options.success = $.proxy(function(data){
                    this.store.set(data);

                    onsuccess.apply(this, arguments);
                }, this);
            }
        }

    });

    return BaseModel;
});