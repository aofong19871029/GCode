define(['dModel', 'penaStore'], function(dModel, penaStore){
    var Model = dModel.extend({
        defaults: {
            prefix: '沪',
            plate: '',
            fullPlate: '',
            engineNum: '',
            city: '上海',
            cityPinyin: 'shanghai',
            province: '上海'
        },

        init: function(){
            this.on('change:prefix change:plate', function(){
                this.set('fullPlate', this.get('prefix') + this.get('plate'));
            });

            this.on('change:city', function(){
                this.set('province', this.get('city'));
            });
        },

        goToSearch: function(){
            penaStore.set({
                city: this.get('cityPinyin'),
                hphm: this.get('fullPlate'),
                engineno: this.get('engineNum'),
                cityname: this.get('city'),
                provincename: this.get('province')
            });


        },

        /**
         * 是否是正确的车牌(不带省份前缀)
         */
        isCarPlate: function(plate){
            return /^[A-Z0-9]{6}$/.test(plate);
        },

        isEngineNum: function(engin){
            return /^\d{6}$/.test(engin);
        }
    });

    return Model;
});