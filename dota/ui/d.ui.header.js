define(['dInherit', 'dBaseUI', 'dValidate'], function(dInherit, dBaseUI, dValidate) {
    var NOOP = function(){},
        headerTpl =
        '<div class="ui-headerview">\
            <header class="ui-header-fixed">\
                <%if(back){%>\
                <span class="ui-func-icon ui-func-return js-back">\
                    <i class="ui-icon ui-arrow-l"></i>\
                    <span>返回</span>\
                </span>\
                <%}%>\
                <%if(moreHtml.trim().length){%>\
                <span class="ui-func-icon ui-func-more js-more"><%=moreHtml%></span>\
                <%}%>\
                <h2><%=titleHtml%></h2>\
            </header>\
        </div>';

    /**
     * View通用头部
     * @param opt
     *
     * {
         *    titleHtml: 中间文字
         *    back: true
         *    moreHtml: 右侧文字
         *    listener: {
         *      backHandler:
         *      moreHandler:
         *      'selector': 'handler
         *    }
         * }
     */
    var Header = dInherit(dBaseUI, {
        __propertys__: function () {
            this.tplFunc = _.template(headerTpl);

            this.root;

            this.inited;
        },
        initialize: function(root){
            this.__superInitialize();

            root && (this.root = root);
        },
        setOpt: function(options){
            options = options || {};

            this.setOptions({
                titleHtml: options.titleHtml || '',
                back: !!options.back,
                moreHtml: options.moreHtml || '',
                listener: options.listener || {}
            });

            // 注册onShow, onHide 回调
            this.onShow = dValidate.isFunction(options.onShow) ? options.onShow : undefined;
            this.onHide = dValidate.isFunction(options.onHide) ? options.onHide : undefined;

            this.attachEvent();

            if(!this.inited) {
                this.root.prepend(this.$el);
                this.inited = true;
            }
        },

        attachEvent: function(){
            var opt = this.opt,
                listener = opt.listener;

            this.$el.off();

            // 回退
            if(opt.back){
                this.bindEvent('click', '.js-back', listener.backHandler || function(){Ancients.back()});
            }

            // 更多按钮
            if(opt.moreHtml){
                this.bindEvent('click', '.js-more', listener.moreHandler);
            }

            // 自定义事件
            for(var i in listener){
                if(i !== 'backHandler' && i !== 'moreHandler' && listener.hasOwnProperty(i)){
                    this.bindEvent('click', i, listener[i]);
                }
            }
        }
    });

    return Header;
});