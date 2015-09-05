define(['dView', 'dPopLayer', 'citylist', 'plateprefix'], function(dView, dPopLayer, citylist, plateprefix){
    var View = dView.extend({
        events: {
            'click .js-preCar': 'showPlateList',
            'click .js-city': 'searchCity',
            'click .js-search': 'search'
        },

        onCreate: function(){
            this.$el.append(this.T['js-penalties-search-wrap']);

            this.embedHeader({
                titleHtml: '违章查询',
                back: true,
                listener: {
                    backHandler: function () {
                        Ancients.cros('index/index.html', 'back');
                    },
                    moreHandler: function () {

                    }
                }
            });

            this.els = {
                search: this.$el.find('.js-search')
            };
        },

        onLoad: function(){

        },

        onHide: function(){
            this.els.search.text('查询');
        },

        bindings: {
            '.js-preCar': 'prefix',
            '.js-plate': 'plate',
            '.js-engineNum': 'engineNum',
            '.js-city': 'city'
        },

        showPlateList: function(){
            var self = this;

            if(!this.platePop) {
                this.platePop = new dPopLayer();
                this.platePop.setOpt({
                    title: '选择省份',
                    body: _.template(this.T['js-plate'], {plate: plateprefix}),
                    root: 'body'
                });
                this.platePop.bindEvent('click', '.js-item', function(e){
                    var target = e.currentTarget,
                        data = JSON.parse(target.getAttribute('data-item'));

                    data && self.model.set('prefix', data.short);
                    self.platePop.hide();
                });
            }

            this.platePop.show();
        },

        searchCity: function(){
            var self = this;

            if(!this.cityPop){
                this.cityPop = new dPopLayer();
                this.cityPop.setOpt({
                    body: this.T['js-searchCity'],
                    root: 'body'
                });

                this.cityPop.bindEvent('click', '.js-item', function(e){
                    var target = e.currentTarget,
                        data = JSON.parse(target.getAttribute('data-item'));

                    if(data) {
                        self.model.set('city', data.city);
                        self.model.set('cityPinyin', data.pinying);
                    }
                    self.cityPop.hide();
                });

                this.cityPop.bindEvent('input', '.js-keyword', function(e){
                    var target = e.currentTarget,
                        keyword = target.value,
                        result = self.queryCity(keyword);

                    self.cityPop.$el.find('.js-penalist').html(_.template(self.T['js-cityfilter'], {citylist: result}));
                });
            }

            this.cityPop.show();
        },

        queryCity: function(keyword){
            var result;

            if(keyword) {
                result = citylist.filter(function (data) {
                    return data.city.indexOf(keyword) !== -1 ||
                        data.pinying.indexOf(keyword) !== -1 ||
                        data.letter.indexOf(keyword) !== -1;
                });
            }

            return result;
        },

        search: function(){
            var plate = this.model.get('plate'),
                engineNum = this.model.get('engineNum'),
                error = [];

            if(!this.model.isCarPlate(plate)){
                error.push('车牌号格式不正确');
            }

            if(!this.model.isEngineNum(engineNum)){
                error.push('发动机号不正确');
            }

            if(error.length){
                this.showToast(error.join('<br/>'));
                return;
            }

            this.els.search.text('正在查询...');

            this.model.goToSearch();
        }


    });

    return View;
});