define(['dView', 'dUrl', 'dSwitch', 'dNumberStep', 'dDateTimeScroll'],
    function(dView, dUrl, dSwitch, dNumberStep, dDateTimeScroll){
    var View = dView.extend({
        events: {
            'click .js-startPoi': function(e){
                Ancients.forward('suggestion.html?from=' + encodeURIComponent('reservation.html?poi=start') + '&keyword=' + e.currentTarget.value.trim());
            },
            'click .js-endPoi': function(e){
                Ancients.forward('suggestion.html?from=' + encodeURIComponent('reservation.html?poi=end') + '&keyword=' + e.currentTarget.value.trim());
            }
        },


        onCreate: function(){
            var self = this;

            this.$el.append(this.T['js-reservation-wrap']);

            //多人拼车
            new dSwitch(this.$el.find('.js-multiPeople'), function(selected){
               self.model.set('multiPlayer', selected);
            }, this.model.get('multiPlayer'));
            //乘坐人数
            this._persionStep = new dNumberStep(this.$el.find('.js-pnum'));
            this._persionStep.setOpt({
                onChange: function(num){
                    self.model.set('personCount', num);
                },
                initalVal: this.model.get('personCount')
            });

            this.els = {
                departureDate: this.$el.find('.js-departureDate')
            };

            // 时间
            new dDateTimeScroll( this.els.departureDate, {
                type: 'datetime'
            });
        },

        onLoad: function(){
           var params = dUrl.getUrlParams(location.href),
               title = params.title || '',
               tag = params.poi,
               address = params.address,
               latlng = params.location;

            switch (title.toLowerCase()) {
                case 'towork':
                    title = '上班约车';
                    break;
                case 'tohome':
                    title = '下班约车';
                    break;
                case 'paul':
                    title = '长途顺丰约车';
                    break;
                default :
                    title = '在线约车';
                    break;
            }

            this.embedHeader({
                titleHtml: title,
                moreHtml: '<span style="margin-left: -1.3rem">计费规则</span>',
                back: true,
                listener: {
                    moreHandler: function(){},
                    backHandler: function(){
                        Ancients.back('home.html');
                    }
                }
            });

            this._persionStep.setNum(this.model.get('personCount'));
            // 设置起始点
            this.model.setPoi(tag, address, latlng);
        },

        onHide: function(){
            this.model.backup();
        },

        bindings: {
            '.js-departureDate': 'departureDate',
            '.js-startPoi': 'departureAddress',
            '.js-endPoi': 'destinationAddress'
        }
    });

    return View;
});