define(['dView'], function(dView){
    var View = dView.extend({
        events: {
            'click #js-login': function(){
                Ancients.forward('/user/login.html');
            }
        },

        onCreate: function(){
            this.$el.append(this.T['js-index-wrap']);
        },

        onLoad: function(){

        },

        onHide: function(){

        }

    });

    return View;
});