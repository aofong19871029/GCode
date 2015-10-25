define(['dModel'], function(dModel){
    var Model = dModel.extend({
        defaults: {
            multiPlayer: false,
            personCount: 1
        }
    });

    return Model;
});