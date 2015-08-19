define(['dView'], function(dView){
    var View = dView.extend({
        events: {

        },

        onCreate: function(){
            this.$el.append(this.T['js-realname-wrap']);
            this.embedHeader({
                titleHtml: '实名登记,',
                moreHtml: '下一步',
                back: true,
                listener: {
                    backHandler: function(){
                        Ancients.back('login.html');
                    },
                    moreHandler: function(){

                    }
                }
            });
        },

        onLoad: function(){

        },

        onHide: function(){

        }
    });

    return View;
});