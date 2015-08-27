define(['dController', 'addcarView', 'addcarModel', 'css!../../css/addcar.css'], function(dController, addcarView, addcarModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new addcarModel(this),
                view = new addcarView({
                    model: model,
                    controller: this
                });

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});