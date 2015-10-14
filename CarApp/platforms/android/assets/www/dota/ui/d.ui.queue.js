define(function(){
    Ancients.UIInstances = [];

    return {
        add: function(instance){
            Ancients.UIInstances.push(instance);
        },
        disposeAll: function(){
            for(var i = 0, l = Ancients.UIInstances.length; i < l ; i++){
                Ancients.UIInstances[i].destory();
            }

            Ancients.UIInstances = [];
        }
    };
});