define(['dModel'], function(dModel){
    var Model = dModel.extend({
        defaults: {
            mobile: '',
            password: '',
            confirmPassword: '',
            code: ''
        },

        /**
         * 发送短信验证码
         */
        sendSMSCode: function(){
            this.request({
                url: ''
            });
        },

        register: function(options){
            this.request($.extend({
                url: 'adduserService'
            }, options || {}));
        }
    });

    return Model;
});