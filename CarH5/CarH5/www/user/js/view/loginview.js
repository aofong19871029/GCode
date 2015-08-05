define(['dView'], function(dView){
    var View = dView.extend({
        initialize: function(){

        },

        onCreate: function(){
        },

        onLoad: function(){
            this.$el.append(this.T['js-wrap']);
        },

        onHide: function(){

        }
    });

    return View;
});