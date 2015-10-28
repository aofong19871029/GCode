define(['dModel', 'carStore', 'dValidate'], function(dModel, carStore, dValidate){
    var reservationStore = carStore.reservationStore;

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

        initialize: function(){
            var self = this,
                data = reservationStore.get();

            if(data){
                _.each(data, function(value, key){
                    self.set(key, value);
                });
            }
        },

        setPoi: function(tag, address, latlng){
            if(dValidate.isEmptyStr(tag) || dValidate.isEmptyStr(address) || dValidate.isEmptyStr(latlng)) return;

            var coords;

            latlng = latlng.split(',');
            if(latlng.length >= 2) {
                coords = {latitude: latlng[0], longitude: latlng[1]};

                switch (tag.toLowerCase()) {
                    case 'end':
                        this.set('destinationAddress', address);
                        this.set('destinationLocation', coords);
                        break;
                    case 'start':
                        this.set('departureAddress', address);
                        this.set('departureLocation', coords);
                        break;
                }
            }
        },

        /**
         * 将model数据备份至store
         */
        backup: function(){
            reservationStore.set({
                departureDate: this.get('departureDate'),
                multiPlayer: this.get('multiPlayer'),
                personCount: this.get('personCount'),
                departureAddress: this.get('departureAddress'),
                departureLocation: this.get('departureLocation'),
                destinationAddress: this.get('destinationAddress'),
                destinationLocation: this.get('destinationLocation')
            });
        }
    });

    return Model;
});