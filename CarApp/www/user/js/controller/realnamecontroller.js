define(['dController', 'realnameView', 'realnameModel', 'css!../../css/realname.css'], function(dController, realnameView, realnameModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new realnameModel(this, 'realname'),
                view = new realnameView({
                    model: model,
                    controller: this
                });

            this.model = model;
            this.view = view;
        }
    });

    return Controller;
});