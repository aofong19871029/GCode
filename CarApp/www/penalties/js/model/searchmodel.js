define(['dModel', 'penaStore', 'dAjax', 'dCookie'], function(dModel, penaStore, dAjax, dCookie){
    var paramStore = penaStore.paramStore;

    var Model = dModel.extend({
        defaults: {
            prefix: '苏',
            plate: 'A0ZN97',
            fullPlate: '',
            engineNum: '8862445',
            city: '上海',
            cityPinyin: 'shanghai',
            province: '上海',
            result: ''
        },

        init: function(){
            this.on('change:prefix change:plate', function(){
                this.set('fullPlate', this.get('prefix') + this.get('plate'));
            });

            this.on('change:city', function(){
                this.set('province', this.get('city'));
            });

            this.loadLastParam();
        },

        loadLastParam: function(){
            var lastParam = paramStore.get();

            if(lastParam){
                this.set({
                    prefix: lastParam.prefix,
                    plate: lastParam.plate,
                    fullPlate: lastParam.prefix + lastParam.plate,
                    cityPinyin: lastParam.cityPinyin,
                    engineno: lastParam.engineNum,
                    city: lastParam.city,
                    province: lastParam.province
                });
            }
        },

        goToSearch: function(){
            paramStore.set({
                prefix: this.get('prefix'),
                plate: this.get('plate'),
                cityPinyin: this.get('cityPinyin'),
                engineno: this.get('engineNum'),
                city: this.get('city'),
                province: this.get('province')
            });

            dAjax.jsonp('https://sp0.baidu.com/9_Q4sjW91Qh3otqbppnN2DJv/pae/traffic/api/query', {
                cb:'jQuery110207175715863704681_1441546594143',
                city: this.get('cityPinyin'),
                hphm: this.get('fullPlate'),
                hpzl: '02',
                engineno: this.get('engineNum'),
                classno: '',
                registno: '',
                cityname: this.get('city'),
                provincename: this.get('province'),
                format: 'json',
                time_used: 3
            },function(){
                debugger
            }, function(){
                debugger
            });

        },

        /**
         * 是否是正确的车牌(不带省份前缀)
         */
        isCarPlate: function(plate){
            return /^[A-Z0-9]{6}$/.test(plate.trim());
        },

        isEngineNum: function(engin){
            return /^\d+$/.test(engin.trim());
        }
    });

    return Model;
});