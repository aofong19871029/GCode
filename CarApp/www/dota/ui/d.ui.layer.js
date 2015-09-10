define(['dInherit', 'dBaseUI', 'dMask', 'dValidate'], function(dInherit, dBaseUI, dMask, dValidate) {
    var layerTpl = '<div class="ui-layer"><%=contentHTML%></div>';

    var Layer = dInherit(dBaseUI, {
        __propertys__: function () {
            this._name = 'Layer';

            this.tplFunc = _.template(layerTpl);

            this.root = $();

            this._mask;

            this.referCount = 0;
        },

        events: {},

        setOpt: function(options){
            var root;

            options = options || {};
            root = options.root;

            this.setOptions({
                contentHTML: options.contentHTML || ''
            });

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

        show: function(){
            if(dValidate.isElHidden(this.$el)) {

                this.referCount++;

                this.$el.show().css('margin', '-' + this.$el.height()/2 + 'px 0 0 -' + this.$el.width()/2 + 'px');

                this._mask.show();
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
            }
        },

        addMask: function(){
            if(!this._mask) {
                this._mask = new dMask('body');
            }
        }

    });

    return Layer;
});