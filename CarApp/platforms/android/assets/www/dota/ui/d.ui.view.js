define(['dInherit', 'dValidate', 'libs'], function(dInherit, dValidate){
    var body = $('body');

    var AnimateView = dInherit({
        __propertys__: function () {
            // sub view-port公共容器
            this.mainframe;

            // view 切换动画
            this.switchAnimation = true;
        },

        slideView: function(action, inController, outController, callback, scope){
            if(this.switchAnimation) {
                switch (action) {
                    case 'forward':
                        this._slideleft(inController, outController, callback, scope);
                        break;
                    case 'back':
                        this._slideright(inController, outController, callback, scope);
                        break;
                }
            } else {
                this._noAnimate(inController, outController, callback, scope);
            }
        },

        /**
         * 从右向左切换
         * @param inController
         * @param outController
         * @param callback
         * @param scope
         * @returns {number}
         * @private
         */
        _slideleft: function (inController, outController, callback, scope) {
            var inView =  this._getControllerRootElement(inController),
                outView = this._getControllerRootElement(outController);

            body.addClass('hiddenx');
            inView.addClass('animatestart');
            inView.addClass('sliderightin');

            inController.load();

            return setTimeout(function () {
                body.removeClass('hiddenx');
                inView.removeClass('animatestart');
                inView.removeClass('sliderightin');

                if (outController) outController.hide();

                dValidate.isFunction(callback) && callback.call(scope, inView, outView);
            }, 190);
        },

        /**
         * 从左向右切换
         * @param inController
         * @param outController
         * @param callback
         * @param scope
         * @returns {number}
         * @private
         */
        _slideright: function (inController, outController, callback, scope) {
            var inView =  this._getControllerRootElement(inController),
                outView = this._getControllerRootElement(outController);

            body.addClass('hiddenx');

            if (outView) {
                outView.addClass('animatestart');
                outView.addClass('sliderightout');
            }

            inController.load();

            return setTimeout(function () {
                body.removeClass('hiddenx');
                if (outView) {
                    outView.removeClass('animatestart');
                    outView.removeClass('sliderightout');
                    outController.hide();
                }

                dValidate.isFunction(callback) && callback.call(scope, inView, outView);

            }, 190);
        },


        _noAnimate: function (inController, outController, callback, scope) {
            //减少重绘和回流
            this.mainframe.hide();

            //in 一定会有 out则不一定
            if (outController) outController.hide();
            inController.load();

            this.mainframe.show();

            dValidate.isFunction(callback) && callback.call(scope, inView, outView);
        },

        _getControllerRootElement: function(controller){
            return dValidate.isObject(controller) && controller.view && controller.view.$el ? controller.view.$el : undefined;
        },

        slideLeft: function(inEl, outEl){
            body.addClass('hiddenx');
            inEl.addClass('animatestart');
            inEl.addClass('sliderightin');
            inEl.show();

            return setTimeout(function () {
                body.removeClass('hiddenx');
                inEl.removeClass('animatestart');
                inEl.removeClass('sliderightin');

                if (outEl) outEl.hide();
            }, 190);
        },

        slideRight: function(inEl, outEl){
            body.addClass('hiddenx');

            if (outEl) {
                outEl.addClass('animatestart');
                outEl.addClass('sliderightout');
            }
            inEl.show();

            return setTimeout(function () {
                body.removeClass('hiddenx');
                if (outEl) {
                    outEl.removeClass('animatestart');
                    outEl.removeClass('sliderightout');
                    outEl.hide();
                }
            }, 190);
        },

        noAnimateSlide: function(inEl, outEl){
            body.hide();

            outEl && outEl.hide();
            inEl.show();

            body.show();
        }
    });

    return AnimateView;
});