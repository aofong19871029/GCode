define(['dInherit'], function(dInherit){
    var BaseControlelr = dInherit({
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

    BaseControlelr.extend = $.proxy(Backbone.Model.extend, BaseControlelr);

    return BaseControlelr;
});