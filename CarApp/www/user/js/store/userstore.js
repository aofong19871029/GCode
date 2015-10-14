define(['dStore'], function(dStore){
    var UserStore = {},
        createBaseStore = function(key, expir){
            return new dStore({
                key: key,
                expir: expir
            });
        };

    UserStore.realNameStore = createBaseStore('realnamestore', '30i');
    UserStore.addCarStore = createBaseStore('addcarstore', '30i');

    return UserStore;
});