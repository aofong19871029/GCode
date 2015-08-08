define(['dController', 'signupView', 'signupModel', 'css!../../css/signup.css'], function(dController, signupView, signupModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new signupModel(this),
                view = new signupView(model, this);

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});