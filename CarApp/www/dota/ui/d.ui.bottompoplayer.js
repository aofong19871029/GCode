/*------------------------

 */

define(['dInherit', 'dBaseUI', 'dMask', 'dValidate', 'dBridge'], function(dInherit, dBaseUI, dMask, dValidate, dBridge) {
    var layerTpl =
        '<div class="ui-bottom-layer">\
            <section class="ui-pop-box">\
                <a class="ui-photo pure-button pure-button-primary">拍照</a>\
                <a class="ui-gallery pure-button pure-button-primary">打开相册</a>\
            </section>\
        </div>';

    var BottomPopLayer = dInherit(dBaseUI, {
        __propertys__: function () {
            this._name = 'bottompoplayer';

            this.tplFunc = _.template(layerTpl);

            this.root = $();

            this._mask;

            this.referCount = 0;

            this._triggerDom;
        },

        events:{
            'click .ui-photo': 'photo',
            'click .ui-gallery': 'gallery'
        },

        setOpt: function(options){
            var self = this,
                root;

            options = options || {};
            root = options.root;

            this.setOptions();

            this.opt.onsuccess = dValidate.isFunction(options.onsuccess) ?
                function(base64) {
                    options.onsuccess(base64, self._triggerDom);
                    self.hide();
                } :
                $.noop;

            this.opt.onerror = dValidate.isFunction(options.onerror) ?
                function(error) {
                    options.onerror(error, self._triggerDom);
                } :
                $.noop;

            if(dValidate.isObject(options.events)){
                this.events = options.events;
            }

            if(dValidate.isHtmlElement(options.root) || dValidate.isZeptoDom(options.root)){
                this.root = $(root);
            } else {
                Ancients.syslog.warn('root can not be empty for layer');
            }

            this.addMask();
            this.$el.hide();
            this.root.append(this.$el);
        },

        show: function(dom){
            if(dValidate.isElHidden(this.$el)) {

                this.referCount++;

                this.$el.show();

                this._mask.show();

                this._triggerDom = dom;
            }
        },

        hide: function(){
            if(dValidate.isElVisible(this.$el)) {
                if (this.referCount > 0) {
                    this.referCount--;
                }

                if (this.referCount === 0) {
                    this.$el.hide();
                }

                this._mask.hide();

                this._triggerDom = null;
            }
        },

        addMask: function(){
            if(!this._mask) {
                this._mask = new dMask('body');
                this._mask.bindEvent('click', this.hide.bind(this));
            }
        },

        photo: function(){
            dBridge.pictureFromCamera(this.opt.onsuccess, this.opt.onerror);
        },

        gallery: function(){
            dBridge.pictureFromPhotolibrary(this.opt.onsuccess, this.opt.onerror);
        }

    });

    return BottomPopLayer;
});