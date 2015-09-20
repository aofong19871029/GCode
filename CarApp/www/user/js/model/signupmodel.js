define(['dModel', 'dBridge'], function(dModel, dBridge){
    var Model = dModel.extend({
        defaults: {
            mobile: '',
            password: '',
            confirmPassword: '',
            code: '',
            imei: dBridge.deviceInfo()['imei']
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
                    code: this.get('code'),
                    imei: this.get('imei')
                }
            }, options || {}));
        }
    });

    return Model;
});