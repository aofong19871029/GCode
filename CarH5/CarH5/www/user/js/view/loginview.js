define(['dView'], function(dView){
    var View = dView.extend({
        events: {
          'submit #js-login-form'  : 'login'
        },

        onCreate: function(){
            this.$el.append(this.T['js-wrap']);
        },

        onLoad: function(){

        },

        onHide: function(){

        },

        /**
         * 登录
         */
        login: function(e){
            debugger;

            e.preventDefault();
        }
    });

    return View;
});