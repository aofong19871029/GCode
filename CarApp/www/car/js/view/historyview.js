define(['dView'], function(dView){
    var View = dView.extend({
        events: {

        },


        onCreate: function(){
            var self = this;

            this.$el.append(this.T['js-history-wrap']);
            this.embedHeader({
                titleHtml: '行程记录',
                back: true,
                listener: {
                }
            });

            this.bindModelListener();
        },

        onLoad: function(){

        },

        onHide: function(){

        },

        bindings: {

        },

        bindModelListener: function(){

        }
    });

    return View;
});