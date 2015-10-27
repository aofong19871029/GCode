define(['dView', 'dBridge'], function(dView, dBridge){
    var View = dView.extend({
        events: {

        },


        onCreate: function(){
            var self = this,
                timer;

            this.$el.append(this.T['js-carsuggestion-wrapper']);
            this.embedHeader({
                titleHtml: '<div class="ui-citys-hd">\
                                <div class="ui-input-bd" style="height: 2.75rem; line-height: 2.7rem;">\
                                    <input class="ui-input-box js-input" placeholder="目的地/区域/位置"/>\
                                    <span class="ui-focus-close js-clear" style="display: none;">×</span>\
                                </div>\
                            </div>',
                back: true,
                listener: {
                    'input .js-input': function(e){
                        var target = $(e.currentTarget),
                            closeIcon = target.parent().find('.js-clear'),
                            queryVal = target.val().trim();

                        closeIcon[queryVal.length ? 'show' : 'hide']();

                        clearTimeout(timer);
                        timer = setTimeout($.proxy(self.query, self, queryVal), 800);
                    },
                    'click .js-clear': function(e){
                        var target = $(e.currentTarget),
                            input = target.parent().find('.js-input');

                        input.val('');
                        target.hide();
                    }
                }
            });
        },

        onLoad: function(){


        },

        onHide: function(){

        },

        bindings: {

        },

        query: function(keyword){
            var self = this,
                pos = dBridge.getCurrentPosition();

            if(!pos){
                this.showToast('定位失败,请开启GPS');
                return;
            }


            dBridge.placeSuggestion(keyword, function(obj){

            }, function(err){
                self.showToast(err.message);
            });
        }
    });

    return View;
});