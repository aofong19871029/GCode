define(['dInherit', 'dAbstractStorage'], function(dInherit, dAbstractStorage){
    var SessionStorage = new dInherit(dAbstractStorage, {
        __propertys__: function(){
            this.proxy = window.sessionStorage;
        }
    });

    SessionStorage.getInstance = function () {
        if (this.instance) {
            return this.instance;
        } else {
            return this.instance = new this();
        }
    };

    return SessionStorage.getInstance();
});