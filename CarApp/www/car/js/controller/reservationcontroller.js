define(['dController', 'reservationView', 'reservationModel', Ancients.cssPath('car/css/reservation.css')], function(dController, reservationView, reservationModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new reservationModel(this),
                view = new reservationView({
                    model: model,
                    controller: this
                });

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});