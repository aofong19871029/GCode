define(['dInherit', 'dBaseUI', 'dValidate'], function(dInherit, dBaseUI, dValidate) {
    var toastTpl =
               '<div class="ui-tlayer ui-toast">\
                   <span><%=message%></span>\
               </div>';

    var Toast = dInherit(dBaseUI, {
        __propertys__: function () {
            this._name = 'Toast';

            this.tplFunc = _.template(toastTpl);

            this.timeout = 2500;

            this.root;
        },

        initialize: function(root){
            this.__superInitialize();

            root && (this.root = root);
        },

        setOpt: function(options) {
            options = options || {};

            this.setOptions({
                message: options.message || ''
            });
        },

        show: function(){
            var self = this;

            this.root.append(this.$el);

            this.$el.show().removeClass('ui-animate-hide').addClass('ui-animate-show');

            setTimeout(function(){
                self.$el.removeClass('ui-animate-show').addClass('ui-animate-hide');

                setTimeout(function(){
                    self.hide();
                },800);
            }, this.timeout);
        }

    });

    return Toast;
});