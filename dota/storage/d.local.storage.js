define(['dInherit', 'dAbstractStorage'], function(dInherit, dAbstractStorage){
    var LocalStorage = dInherit(dAbstractStorage, {
        __propertys__: function(){
            this.proxy = window.localStorage;
        }
    });

    LocalStorage.getInstance = function () {
        if (this.instance) {
            return this.instance;
        } else {
            return this.instance = new this();
        }
    };

    return LocalStorage;
});