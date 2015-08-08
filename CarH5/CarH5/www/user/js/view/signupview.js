define(['dView'], function(dView){
    var View = dView.extend({
        events: {
            'click .js-back'  : 'backToLogin'
        },

        onCreate: function(){
            this.$el.append(this.T['js-signup-wrap']);
        },

        onLoad: function(){

        },

        onHide: function(){

        },

        backToLogin: function(){
            Ancients.back();
        }
    });

    return View;
});