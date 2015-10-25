define(['dController', 'suggestionView', 'suggestionModel', Ancients.cssPath('car/css/suggestion.css')], function(dController, suggestionView, suggestionModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new suggestionModel(this),
                view = new suggestionView({
                    model: model,
                    controller: this
                });

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});