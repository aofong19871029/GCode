define(['dView'], function(dView){
    var View = dView.extend({
        events: {
            'click #js-index': function(){Ancients.cros('index/index.html');},
            'click #js-newcar': function(){Ancients.forward('realname.html');}
        },

        onCreate: function(){
            this.$el.append(this.T['js-signup-wrap']);

        },

        onLoad: function(){

        },

        onHide: function(){

        }
    });

    return View;
});