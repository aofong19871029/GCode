define(['dView'], function(dView){
    var View = dView.extend({
        events: {
            'click .js-book': 'reserveCar'
        },


        onCreate: function(){
            var self = this;

            this.$el.append(this.T['js-carindex-wrap']);
            this.embedHeader({
                titleHtml: '<div class="car-title"><span class="js-role" data-role="driver">车主</span><span class="active js-role" data-role="passenger">乘客</span></div>',
                back: true,
                listener: {
                    'click .js-role': function(e){
                        var target = $(e.currentTarget);

                        self.model.set('role', target.attr('data-role'));
                    }
                }
            });

            this.bindModelListener();
        },

        onLoad: function(){
            this.changeRole(this.model.get('role'));
        },

        onHide: function(){

        },

        bindings: {

        },

        bindModelListener: function(){
            var self = this;

            this.listenTo(this.model, 'change:role', function(model, newVal){
                self.changeRole(newVal);
            });
        },

        reserveCar: function(e){
            var target = $(e.currentTarget),
                action = target.attr('data-action'),
                url = 'reservation.html?action=';

            if(action) {
                action = action.toLowerCase();
                url += action;
            }

            Ancients.forward(url);
        },

        changeRole: function(role){
            var roleDom = this.$el.find('.js-role').removeClass('active');

            roleDom.filter('[data-role="' + role +'"]').addClass('active');
        }
    });

    return View;
});