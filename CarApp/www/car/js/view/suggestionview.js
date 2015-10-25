define(['dView'], function(dView){
    var View = dView.extend({
        events: {

        },


        onCreate: function(){
            this.$el.append(this.T['js-carsuggestion-wrapper']);
            this.embedHeader({
                titleHtml: '<div class="ui-citys-hd">\
                                <div class="ui-input-hd">\
                                <input class="ui-input-box" placeholder="目的地/区域/位置"/>\
                                <span class="ui-pro-load js_input_loading_icon" style="display: none;">\
                                    <span class="ui-pro-radius hide"></span>\
                                    <span class="ui-i ui-pro-logo"></span>\
                                </span> \
                                <span class="ui-focus-close" style="display: none;">×</span>\
                                </div>\
                            </div>',
                moreHtml: '<button type="button" class="ui-btn-cancle">取消</button>',
                back: true,
                listener: {
                    moreHandler: function(){}
                }
            });
        },

        onLoad: function(){
            window.locationService.getCurrentPosition(function(pos){
                alert(JSON.stringify(pos))
            },
                function(pos){
                    alert(JSON.stringify(pos))
                });

        },

        onHide: function(){

        },

        bindings: {

        }
    });

    return View;
});