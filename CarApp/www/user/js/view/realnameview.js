define(['dView'], function(dView){
    var View = dView.extend({
        events: {

        },

        onCreate: function(){
            var self = this;

            this.$el.append(this.T['js-realname-wrap']);
            this.embedHeader({
                titleHtml: '实名登记',
                moreHtml: '下一步',
                back: true,
                listener: {
                    backHandler: function(){
                        Ancients.back('login.html');
                    },
                    moreHandler: self.save
                }
            });
        },

        onLoad: function(){

        },

        onHide: function(){

        },

        save: function(){
            Ancients.forward('addcar.html');
        }
    });

    return View;
});