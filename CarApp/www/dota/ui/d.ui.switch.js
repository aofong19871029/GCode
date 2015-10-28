define(['dInherit', 'dBaseUI', 'dValidate'], function(dInherit, dBaseUI, dValidate) {
    var switchTpl =
        '<div class="ui-switch<%if(selected){%> current<%}%>">\
            <div class="ui-switch-bg<%if(selected){%> current<%}%>"></div>\
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

        initialize: function(root, callback, selected){
            this.__superInitialize();

            root && (this.root = root);

            this.setOptions({
                selected: selected
            });

            this.$el.show();
            this.root.append(this.$el);

            this.opt.callback = dValidate.isFunction(callback) ? callback : $.noop;
            this.selected = !!this.opt.selected;
        },

        switchStatus: function(e){
            var container = $(e.currentTarget),
                bg = container.find('.ui-switch-bg'),
                action = this.selected ? 'removeClass' : 'addClass';

            container[action]('current');
            bg[action]('current');
            this.selected = !this.selected;
            this.opt.callback(this.selected);
        }

    });

    return Switch;
});