define(['dView'], function(dView){
    var View = dView.extend({
        events: {

        },

        onCreate: function(){
            this.$el.append(this.T['js-index-wrap']);
        },

        onLoad: function(){
            setTimeout(function() {
                Ancients.forward('../user/login.html');
            }, 500);
        },

        onHide: function(){

        }

    });

    return View;
});