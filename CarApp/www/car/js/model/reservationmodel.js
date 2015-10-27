define(['dModel'], function(dModel){
    var Model = dModel.extend({
        defaults: {
            departureDate: '',
            multiPlayer: false,
            personCount: 1,
            departureAddress: '',
            departureLocation: '',
            destinationAddress: '',
            destinationLocation: ''
        },

        setPoi: function(tag, address, location){

        }
    });

    return Model;
});