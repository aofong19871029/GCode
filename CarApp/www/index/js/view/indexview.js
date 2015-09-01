define(['dView', 'swipe'], function(dView, swipe){
    var View = dView.extend({
        events: {
            'click .js-login': function(){
                Ancients.forward('/user/login.html');
            }
        },

        onCreate: function(){
            this.$el.append(this.T['js-index-wrap']);

            this.els = {
                scrollWrap: this.$el.find('.js-slider'),
                scrollPager: this.$el.find('.js-pager'),
                scrollCtrl: this.$el.find('.js-pager>span')
            };
        },

        onShow: function(){
            this.swipeNews();
        },

        onLoad: function(){

        },

        onHide: function(){

        },

        swipeNews: function() {
            var self = this,
                selectedCls = 'cur';

                swipe(this.els.scrollWrap[0], {
                continuous: true,
                transitionEnd: function (idx, element) {
                },
                callback: function (idx, element) {
                    self.els.scrollCtrl.filter('.' + selectedCls).removeClass(selectedCls);
                    self.els.scrollCtrl.eq(idx).addClass(selectedCls);
                }
            });
        }


    });

    return View;
});