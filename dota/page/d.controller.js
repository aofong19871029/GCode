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
            var self = this;

            this.view.load();

            // 300ms 后动画切换完成, view显示后再执行show
            setTimeout(function(){
                self.show();
            }, 300);
        },

        show: function(){
            this.view.show();
        },

        hide: function(){
            this.view.hide();
        }
    });

    BaseControlelr.extend = $.proxy(Backbone.Model.extend, BaseControlelr);

    return BaseControlelr;
});