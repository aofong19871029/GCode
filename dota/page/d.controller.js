define(['dInherit'], function(dInherit){
    var Controlelr = dInherit({
        __propertys__: function(){
            this.model = null;

            this.view = null;
        },

        create: function(){
            this.view.create();
        },

        load: function(){
            this.view.load();
        },

        hide: function(){
            this.view.hide();
        }
    });

    Controlelr.extend = $.proxy(Backbone.Model.extend, Controlelr);

    return Controlelr;
});