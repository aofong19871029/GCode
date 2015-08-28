define(['dController', 'indexView', 'indexModel', Ancients.cssPath('index/css/index.css')], function(dController, indexView, indexModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new indexModel(this),
                view = new indexView({
                    model: model,
                    controller: this
                });

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});