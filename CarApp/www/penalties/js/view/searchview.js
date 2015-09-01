define(['dView'], function(dView){
    var View = dView.extend({
        events: {

        },

        onCreate: function(){
            this.$el.append(this.T['js-penalties-search-wrap']);

            this.embedHeader({
                titleHtml: '违章查询',
                back: true,
                listener: {
                    backHandler: function () {
                        Ancients.cros('index/index.html', 'back');
                    },
                    moreHandler: function () {

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