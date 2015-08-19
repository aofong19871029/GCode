define(['dController', 'signupdoneView', 'signupdoneModel', 'css!../../css/signupdone.css'], function(dController, signupdoneView, signupdoneModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new signupdoneModel(this),
                view = new signupdoneView({
                    model: model,
                    controller: this
                });

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});