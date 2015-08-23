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
                url: '',
                data: {
                    phoneNumber: this.get('mobile')
                }
            });
        },

        register: function(options){
            this.request($.extend({
                url: 'adduserService',
                data: {
                    mobile: this.get('mobile'),
                    password: this.get('password'),
                    confirmPassword: this.get('confirmPassword'),
                    code: this.get('code')
                }
            }, options || {}));
        }
    });

    return Model;
});