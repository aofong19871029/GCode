define(['dView', 'dValidate'], function(dView, dValidate){
    var View = dView.extend({
        events: {
            'click #js-submit': 'login',
            'click #js-security': 'getCode',
            'click #js-loginType': 'changeLoginType'
        },


        onCreate: function(){
            this.$el.append(this.T['js-wrap']);
            this.embedHeader({
                titleHtml: '登录'
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
            this.els.submit.text('登录');
        },

        onHide: function(){

        },

        bindings: {
            '#js-phone': 'mobile',
            '#js-pwd': 'password',
            '#js-code': 'code'
        },

        /**
         * 登录
         */
        login: function(e){
            var self = this,
                loginType = this.model.get('loginType'),
                mobile = this.model.get('mobile'),
                password = this.model.get('password'),
                code = this.model.get('code'),
                error = [],
                func;

            !dValidate.isMobile(mobile) && error.push('请输入正确的手机号');

            switch (loginType.toUpperCase()){
                case 'P':
                    !dValidate.isValidPassword(password) && error.push('密码长度不得小于6');
                    func = 'loginWithPassword';
                    break;
                case 'C':
                    dValidate.isEmptyStr(code) && error.push('验证码为空');
                    func = 'loginWithCode';
                    break;
            }

            if(error.length){
                this.showToast(error.join('<br/>'));
                return;
            }

            this.els.submit.text('登录中。。。');
            this.model[func]({
                success: function(data){
                    var rs = JSON.parse(data);

                    if(rs == null || rs.code !== '00000'){
                        self.showToast('登录失败,' + rs.Message);

                        self.els.submit.text('登录');
                    } else {
                        self.els.submit.text('跳转中。。。');

                        Ancients.forward('signupdone.html');
                    }
                },
                error: function(){
                    self.els.submit.text('登录');
                    self.showToast('系统错误， 登录失败');
                }
            });

            Ancients.forward('signupdone.html');
        },

        smsEnabled: true,
        /**
         * 发送短信验证码
         */
        getCode: function(e){
            var self = this,
                sec = 29,
                timer;

            e.preventDefault();
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

        changeLoginType: function(){
            var target = this.els.loginType,
                type = target.attr('data-type');;

            type = type && type.toUpperCase();
            type = type === 'P' ? 'C' : 'P';
            target.attr('data-type', type);


            this.els.pwdPanel[type === 'P' ? 'show': 'hide']();
            this.els.codePanel[type === 'P' ? 'hide': 'show']();
            target.text(type === 'P' ? '短信验证码登录' : '帐号密码登录');

            this.model.set('loginType', type);
        }
    });

    return View;
});