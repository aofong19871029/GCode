define(['dView'], function(dView){
    var View = dView.extend({
        events: {

        },


        onCreate: function(){
            this.$el.append(this.T['js-carindex-wrap']);
            this.embedHeader({
                titleHtml: '<div class="car-title"><span class="active">车主</span><span>乘客</span></div>',
                back: true
            });

            this.els = {
                phone: this.$el.find('#js-phone'),
                password: this.$el.find('#js-pwd'),
                code: this.$el.find('#js-security'),
                submit: this.$el.find('#js-submit'),
                loginType: this.$el.find('#js-loginType'),
                changePwd: this.$el.find('#js-changePwd'),
                pwdPanel: this.$el.find('.js-pwdPanel'),
                codePanel: this.$el.find('.js-codePanel')
            }
        },

        onLoad: function(){

        },

        onHide: function(){

        },

        bindings: {

        }
    });

    return View;
});