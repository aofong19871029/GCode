define(['dModel', 'carStore'], function(dModel, carStore){
    var roleStore = carStore.roleStore;

    var Model = dModel.extend({
        defaults: {
            role: 'passenger'
        },

        initialize: function(){
            var self = this,
                data = roleStore.get();

            if(data){
                _.each(data, function(value, key){
                    self.set(key, value);
                });
            }

            // 时时更新role
            this.on('change:role', function(model, newVal){
                roleStore.setAttr('role', newVal);
            });
        }
    });

    return Model;
});