define(['dModel'], function(dModel){
    var Model = dModel.extend({
        defaults: {
            mobile: '',
            password: '',
            code: '',
            loginType: 'P'
        },

        /**
         * 发送短信验证码
         */
        sendSMSCode: function(){
            this.request({
                url: ''
            });
        },

        loginWithPassword: function(options){
            this.request($.extend({
                url: 'pwdloginService'
            }, options || {}));
        },

        loginWithCode: function(options){
            this.request($.extend({
                url: 'smsloginService'
            }, options || {}));
        }
    });

    return Model;
});