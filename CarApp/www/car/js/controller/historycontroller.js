define(['dController', 'historyView', 'historyModel', Ancients.cssPath('car/css/history.css')], function(dController, historyView, historyModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new historyModel(this),
                view = new historyView({
                    model: model,
                    controller: this
                });

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});