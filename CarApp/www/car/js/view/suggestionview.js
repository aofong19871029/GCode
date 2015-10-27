define(['dView', 'dBridge', 'dUrl'], function(dView, dBridge, dUrl){
    var searchPoiTpl =
        '<%_.each(pois, function(poi, i){%>\
            <li class="js-poi" data-poi=<%=JSON.stringify(poi)%>>\
            <div class="asso-l"><%=poi.name%></div>\
            <span class="asso-r fr"><%=poi.district%></span>\
            </li>\
        <%})%>',
        searchPoiTplFunc = _.template(searchPoiTpl);

    var View = dView.extend({
        events: {
            'click .js-poi': 'selectPoi'
        },


        onCreate: function(){
            var self = this,
                timer;

            this.$el.append(this.T['js-carsuggestion-wrapper']);
            this.embedHeader({
                titleHtml: '<div class="ui-citys-hd">\
                                <div class="ui-input-bd" style="height: 2.75rem; line-height: 2.7rem;">\
                                    <input class="ui-input-box js-input" placeholder="目的地/区域/位置"/>\
                                    <span class="ui-focus-close js-clear" style="display: none;">×</span>\
                                </div>\
                            </div>',
                back: true,
                listener: {
                    'input .js-input': function(e){
                        var target = $(e.currentTarget),
                            closeIcon = target.parent().find('.js-clear'),
                            queryVal = target.val().trim();

                        closeIcon[queryVal.length ? 'show' : 'hide']();

                        clearTimeout(timer);
                        timer = setTimeout($.proxy(self.query, self, queryVal), 800);
                    },
                    'click .js-clear': function(e){
                        var target = $(e.currentTarget),
                            input = target.parent().find('.js-input');

                        input.val('');
                        target.hide();
                        self.query();
                    },
                    backHandler: function(){
                        var from = decodeURIComponent(dUrl.getUrlParam(location.href, 'from')).trim();

                        Ancients.back(from || undefined);
                    }
                }
            });

            this.els = {
                loading: this.$el.find('.js-load'),
                destination: this.$el.find('.js-destination'),
                noresult: this.$el.find('.js-noresult'),
                destinationToolbar: this.$el.find('.js-destinationToolbar'),
                input: this.$el.find('.js-input')
            };
        },

        onLoad: function(){
            var keyword = dUrl.getUrlParam(location.href, 'keyword').trim();

            this.els.input.val(keyword);
            this.query(keyword);
        },

        onHide: function(){

        },

        bindings: {

        },

        query: function(keyword){
            var self = this,
                pos = dBridge.getCurrentPosition();

            this.els.noresult.hide();
            this.els.destination.hide().empty();
            this.els.destinationToolbar.hide();

            if(!keyword || !(keyword + '').trim().length) return;

            if(!pos){
                this.showToast('定位失败,请开启GPS');
                return;
            }

            this.els.loading.show();

            dBridge.placeSuggestion(keyword, 131, function(pois){
                self.els.loading.hide();

                self.els.destinationToolbar.show();
                self.els.destination.html(searchPoiTplFunc({pois: pois}));
                self.els.destination.show();
            }, function(){
                self.els.loading.hide();
                self.els.noresult.show();
            });
        },

        selectPoi: function(e){
            var from = decodeURIComponent(dUrl.getUrlParam(location.href, 'from')).trim(),
                target = $(e.currentTarget),
                poi = target.attr('data-poi'),
                params;

            if(poi){
                poi = JSON.parse(poi);
                params = {
                    address: poi.name,
                    location: [poi.location.lat, poi.location.lng].join(',')
                };
            }

            from = dUrl.setParams(from, params);

            Ancients.back(from || undefined);
        }
    });

    return View;
});