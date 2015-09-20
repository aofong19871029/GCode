define(['dController', 'realnameView', 'realnameModel', Ancients.cssPath('user/css/realname.css')], function(dController, realnameView, realnameModel){
    var Controller = dController.extend({
        initialize: function(){
            var model = new realnameModel(this),
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