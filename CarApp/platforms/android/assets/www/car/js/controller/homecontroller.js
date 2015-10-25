define(['dController', 'homeView', 'homeModel', Ancients.cssPath('car/css/carindex.css')], function(dController, homeView, homeModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new homeModel(this),
                view = new homeView({
                    model: model,
                    controller: this
                });

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});