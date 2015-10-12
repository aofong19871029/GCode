define(['dInherit', 'dBaseUI', 'dLayer', 'dValidate'], function(dInherit, dBaseUI, dLayer, dValidate) {
    var popLayerTpl =
        '<div class="ui-pop-box">\
            <div class="ui-bd">\
                <div class="ui-error-tips"><%=title%></div>\
                <div class="ui-roller-btns">\
                    <div class="ui-flexbd ui-btns-cancel">取消</div>\
                    <div class="ui-flexbd ui-btns-sure">确定</div>\
                </div>\
            </div>\
          </div>';

    var ConfirmLayer = dInherit(dLayer, {
        __propertys__:  function(){
            this._name = 'confir,layer';
        },

        events:{
            'click .ui-btns-cancel': 'cancel',
            'click .ui-btns-sure': 'sure'
        },

        setOpt: function(options){
            var contentHTML = _.template(popLayerTpl, {
                title: options.title || ''
            });

            options.contentHTML = contentHTML;

            this._super.setOpt.call(this, options);

            this.opt.oncancel = dValidate.isFunction(options.oncancel) ? options.oncancel : $.noop;
            this.opt.onsure = dValidate.isFunction(options.onsure) ? options.onsure : $.noop;
        },

        cancel: function(){
            this.opt.oncancel();

            this.hide();
        },

        sure: function(){
            this.opt.onsure();

            this.hide();
        },

        resetOpt: function(options){
            this.opt.oncancel = dValidate.isFunction(options.oncancel) ? options.oncancel : $.noop;
            this.opt.onsure = dValidate.isFunction(options.onsure) ? options.onsure : $.noop;
        }
    });

    return ConfirmLayer;
});