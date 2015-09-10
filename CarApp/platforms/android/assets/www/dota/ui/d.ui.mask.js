/**
 * 水平垂直居中
 */

define(['dInherit', 'dBaseUI', 'dValidate'], function(dInherit, dBaseUI, dValidate) {
    var maskTpl = '<div class="ui-mask" style="display: none"></div>';

    var Mask = dInherit(dBaseUI, {
        __propertys__: function () {
            this._name = 'Mask';

            this.tplFunc = _.template(maskTpl);

            this.referCount = 0;
        },

        events: {
            'touchmove': function(e){e.preventDefault(); }
        },

        initialize: function(root){
            this.__superInitialize();

            this.setOptions();

            if(dValidate.isHtmlElement(root) || dValidate.isZeptoDom(root)) {
                $(root).append(this.$el);
            }
        },

        show: function(){
            if(dValidate.isElHidden(this.$el)) {

                this.referCount++;

                this.$el.show();
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
            }
        }

    });

    return Mask;
});