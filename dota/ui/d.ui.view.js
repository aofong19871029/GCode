define(function(){
    return {
        slideleft: function (inView, outView, callback, scope) {
            $('body').addClass('hiddenx');
            inView.addClass('animatestart');
            inView.addClass('sliderightin');

            inView._show();

            return setTimeout(function () {
                $('body').removeClass('hiddenx');
                inView.removeClass('animatestart');
                inView.removeClass('sliderightin');

                if (outView) outView._hide(inView.viewname);

                callback && callback.call(scope, inView, outView);
            }, 340);
        },
        slideright: function (inView, outView, callback, scope) {
            $('body').addClass('hiddenx');

            if (outView) {
                outView.addClass('animatestart');
                outView.addClass('sliderightout');
            }

            inView._show();

            return setTimeout(function () {
                $('body').removeClass('hiddenx');
                if (outView) {
                    outView.removeClass('animatestart');
                    outView.removeClass('sliderightout');
                    outView._hide(inView.viewname);
                }

                callback && callback.call(scope, inView, outView);

            }, 340);
        },


        noAnimate: function (inView, outView, callback, scope) {
            //减少重绘和回流
            this.mainframe.hide();

            //in 一定会有 out则不一定
            if (outView) outView.__hide(inView.viewname);
            inView.__show();

            this.mainframe.show();

            callback && callback.call(scope, inView, outView);

        }

    };
});