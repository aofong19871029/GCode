define(['dModel', 'dDate'], function(dModel, dDate){
    var Model = dModel.extend({
        defaults: {
            insureDate: '',
            brandId: '',
            modelId: '',
            carPhoto: '',
            carId: '',
            engineNum: '',
            dirLicense: ''
        }
    });

    return Model;
});