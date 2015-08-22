define(['dView'], function(dView){
    var View = dView.extend({
        events: {

        },

        onCreate: function(){
            this.$el.append(this.T['js-index-wrap']);
        },

        onLoad: function(){
            Ancients.forward('../user/login.html');
        },

        onHide: function(){

        }

    });

    return View;
});