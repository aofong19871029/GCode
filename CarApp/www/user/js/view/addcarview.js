define(['dView'], function(dView){
    var View = dView.extend({
        events: {

        },

        onCreate: function(){
            this.$el.append(this.T['js-addcar-wrap']);
            this.embedHeader({
                titleHtml: '新增车辆',
                moreHtml: '完成',
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