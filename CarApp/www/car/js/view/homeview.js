define(['dView'], function(dView){
    var View = dView.extend({
        events: {
            'click .js-book': 'reserveCar'
        },


        onCreate: function(){
            this.$el.append(this.T['js-carindex-wrap']);
            this.embedHeader({
                titleHtml: '<div class="car-title"><span class="active">车主</span><span>乘客</span></div>',
                back: true
            });
        },

        onLoad: function(){

        },

        onHide: function(){

        },

        bindings: {

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
        }
    });

    return View;
});