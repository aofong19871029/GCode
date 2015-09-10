define(['dInherit', 'dBaseUI', 'dLayer'], function(dInherit, dBaseUI, dLayer) {
    var popLayerTpl =
            '<section class="ui-pop-box">\
                <%if(title){%>\
                <div class="ui-pop-hdview">\
                    <div class="ui-pop-hd">\
                    <%=title%>\
                    <span class="ui-pop-close js-pop-close"><span class="ui-top-close">x</span></span>\
                    </div>\
                </div>\
                <%}%>\
                <div class="ui-pop-bd"><%=body%></div>\
            </section>';

    var PopLayer = dInherit(dLayer, {
        __propertys__:  function(){
            this._name = 'poplayer';
        },

        events:{
            'click .js-pop-close': 'hide'
        },

        setOpt: function(options){
            var contentHTML = _.template(popLayerTpl, {
                title: options.title || '',
                body: options.body || ''
            });

            options.contentHTML = contentHTML;

            this._super.setOpt.call(this, options);

            this._mask.bindEvent('click', this.hide.bind(this));
        }
    });

    return PopLayer;
});