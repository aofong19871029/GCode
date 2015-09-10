define(['dModel'], function(dModel){
    var Model = dModel.extend({
        defaults: {
            nickName: '',
            name: '',
            portrait: '',
            drivingLicense: '',
            drivingPhoto: ''
        }
    });

    return Model;
});