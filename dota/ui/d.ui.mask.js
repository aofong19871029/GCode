define(['dInherit', 'dBaseUI', 'dValidate'], function(dInherit, dBaseUI, dValidate) {

    var Mask = dInherit(dBaseUI, {
        __propertys__: function () {
            this._name = 'Mask';

            this.tpl = '<div class="ui-mask"></div>';


            this.referCount = 0;
        },

        initialize: function(root){
            this.__superInitialize();
        },

        show: function(){

        },

        hide: function(){}

    });

    return Mask;
});