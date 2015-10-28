define(['dInherit', 'dBaseUI', 'dValidate'], function(dInherit, dBaseUI, dValidate) {
    var numberTpl =
        '<div class="ui-increase-decrease">\
            <i class="ui-minus<%if(initalVal<=min){%> disabled<%}%>" data-operator="-"></i>\
            <span class="item"><%=initalVal%></span>\
            <i class="ui-plus<%if(initalVal>=max){%> disabled<%}%>" data-operator="+"></i>\
        </div>';

    var NumberStep = dInherit(dBaseUI, {
        __propertys__: function () {
            this._name = 'numberStep';

            this.tplFunc = _.template(numberTpl);

            this.root;

            this.currentNum = 1
        },

        events: {
            'click .ui-minus': 'plusMinus',
            'click .ui-plus': 'plusMinus'
        },

        initialize: function(root){
            this.__superInitialize();

            root && (this.root = root);
        },

        setOpt: function(options) {
            options = options || {};

            var max = dValidate.isNull(options.max) || !dValidate.isNumber(options.max) ? 4 : options.max,
                min = dValidate.isNull(options.min) || !dValidate.isNumber(options.min) ? 1 : options.min;

            this.setOptions({
                max: max,
                min: min,
                initalVal: dValidate.isNumber(options.initalVal) && options.initalVal >= min && options.initalVal <= max ? options.initalVal : options.min,
                step: 1,
                onChange: dValidate.isFunction(options.onChange) ? options.onChange :  $.noop,
                onMax: dValidate.isFunction(options.onMax) ? options.onMax :  $.noop,
                onMin: dValidate.isFunction(options.onMin) ? options.onMin :  $.noop
            });

            this.$el.show();
            this.root.append(this.$el);

            this.els = {
                minus: this.$el.find('.ui-minus'),
                plus: this.$el.find('.ui-plus'),
                val: this.$el.find('.item')
            };
        },

        _changeStatus: function(type, action) {
            var method = action === 'disable' ? 'addClass' : 'removeClass',
                disableCls = 'disabled';

            if ('+' === type) {
                this.els.plus[method](disableCls);
            }
            else if ('-' === type) {
                this.els.minus[method](disableCls);
            }
            else{
                this.els.plus[method](disableCls);
                this.els.minus[method](disableCls);
            }
        },
        disable: function(type) {
            this._changeStatus(type, 'disable');
        },
        enable: function(type) {
            this._changeStatus(type, 'enable');
        },

        plusMinus: function(e){
            var target = $(e.currentTarget),
                num = this.currentNum,
                operator = target.attr('data-operator');

            if(target.hasClass('disabled')) return;

            if(operator === '-' && num > this.opt.min) num--;
            else if(operator === '+' && num < this.opt.max) num++;

            this.enable();

            if(num <= this.opt.min){
                this.disable('-');
                this.opt.onMin(num);
            }
            if(num >= this.opt.max){
                this.disable('+');
                this.opt.onMax(num);
            }

            this.currentNum = num;
            this.els.val.html(num);
            this.opt.onChange(num);
        },

        setNum: function(num){
            if(dValidate.isNumber(num) && num >= this.opt.min && num <= this.opt.max){
                this.currentNum = num + 1;

                this.$el.find('.item').text(this.currentNum);
                this.$el.find('.ui-minus').removeClass('disabled').trigger('click');
            }
        }

    });

    return NumberStep;
});