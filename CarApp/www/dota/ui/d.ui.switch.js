define(['dInherit', 'dBaseUI', 'dValidate'], function(dInherit, dBaseUI, dValidate) {
    var switchTpl =
        '<div class="ui-switch">\
            <div class="ui-switch-bg"></div>\
            <div class="ui-switch-scroll"></div>\
        </div>';

    var Switch = dInherit(dBaseUI, {
        __propertys__: function () {
            this._name = 'Switch';

            this.tplFunc = _.template(switchTpl);

            this.root;

            this.selected = false;
        },

        events: {
            'click': 'switchStatus'
        },

        initialize: function(root, callback){
            this.__superInitialize();

            root && (this.root = root);

            this.setOptions();

            this.$el.show();
            this.root.append(this.$el);

            this.opt.callback = dValidate.isFunction(callback) ? callback : $.noop;
        },

        switchStatus: function(e){
            var container = $(e.currentTarget),
                bg = container.find('.ui-switch-bg'),
                action = this.status ? 'removeClass' : 'addClass';

            container[action]('current');
            bg[action]('current');
            this.status = !this.status;
            this.opt.callback(this.status);
        }

    });

    return Switch;
});