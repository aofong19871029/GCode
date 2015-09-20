define(['dModel', 'dCryptMd5', 'dBridge'], function(dModel, dCryptMd5, dBridge){
    var Model = dModel.extend({
        defaults: {
            mobile: '',
            password: '',
            code: '',
            loginType: 'P',
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

        loginWithPassword: function(options){
            this.request($.extend({
                url: 'pwdloginService',
                data: {
                    phoneNumber: this.get('mobile'),
                    passwd: dCryptMd5(this.get('password')),
                    imei: this.get('imei')
                }
            }, options || {}));
        },

        loginWithCode: function(options){
            this.request($.extend({
                url: 'smsloginService',
                data: {
                    phoneNumber: this.get('mobile'),
                    smsCode: this.get('code'),
                    imei: this.get('imei')
                }
            }, options || {}));
        }
    });

    return Model;
});