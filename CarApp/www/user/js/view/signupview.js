define(['dView', 'dValidate'], function(dView, dValidate){
    var View = dView.extend({
        events: {
            'click #js-submit': 'register',
            'click #js-security': 'getCode'
        },

        onCreate: function(){
            this.$el.append(this.T['js-signup-wrap']);
            this.embedHeader({
                titleHtml: '注册会员',
                back: true
            });

            this.els = {
                phone: this.$el.find('#js-phone'),
                password: this.$el.find('#js-pwd'),
                confirmPassword: this.$el.find('#js-confirmPwd'),
                code: this.$el.find('#js-security'),
                submit: this.$el.find('#js-submit')
            }
        },

        onLoad: function(){

        },

        onHide: function(){

        },

        bindings: {
            '#js-phone': 'mobile',
            '#js-pwd': 'password',
            '#js-confirmPwd': 'confirmPassword',
            '#js-code': 'code'
        },

        smsEnabled: true,
        /**
         * 发送短信验证码
         */
        getCode: function(){
            var self = this,
                sec = 29,
                timer;

            if(!this.smsEnabled) return;

            this.model.sendSMSCode();
            this.smsEnabled = false;
            this.els.code.addClass('disabled').text('30秒后重发验证码');

            timer = setInterval(function(){
                if(sec > 0){
                    self.els.code.text(sec + '秒后重发验证码');
                } else{
                    clearInterval(timer);
                    self.els.code.removeClass('disabled').text('发送短信验证码');
                    self.smsEnabled = true;
                }
                sec--;
            }, 1000);
        },

        register: function(){
            var self = this,
                mobile = this.model.get('mobile'),
                password = this.model.get('password'),
                confirmPassword = this.model.get('confirmPassword'),
                code = this.model.get('code'),
                error = [];

            !dValidate.isMobile(mobile) && error.push('请输入正确的手机号');
            !dValidate.isValidPassword(password) && error.push('密码长度不得小于6');
            dValidate.isEmptyStr(code) && error.push('验证码为空');
            !dValidate.isEqual(password, confirmPassword) && error.push('密码不一致');


            if(error.length){
                this.showToast(error.join('<br/>'));
                return;
            }

            this.model.register({
                data: {
                    phoneNumber: mobile,
                    passwd: password,
                    smsCode: code
                },
                success: function(data){
                    var rs = JSON.parse(data);

                    if(rs == null || rs.code !== '00000'){
                        self.showToast('注册失败,' + rs.Message);
                    } else {
                        Ancients.forward('signupdone.html');
                    }
                },
                error: function(){
                    self.showToast('系统错误， 注册失败');
                }
            });
        }
    });

    return View;
});