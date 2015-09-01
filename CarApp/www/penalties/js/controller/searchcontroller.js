define(['dController', 'searchView', 'searchModel', Ancients.cssPath('penalties/css/search.css')], function(dController, searchView, searchModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new searchModel(this),
                view = new searchView({
                    model: model,
                    controller: this
                });

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});