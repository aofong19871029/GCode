define(['dView', 'dUrl', 'dSwitch', 'dNumberStep', 'dDateTimeScroll'], function(dView, dUrl, dSwitch, dNumberStep, dDateTimeScroll){
    var View = dView.extend({
        events: {

        },


        onCreate: function(){
            var self = this,
                title = dUrl.getUrlParam('action').toLowerCase();

            switch (title) {
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

            this.$el.append(this.T['js-reservation-wrap']);
            new dSwitch(this.$el.find('.js-multiPeople'), function(selected){
               self.model.set('multiPlayer', selected);
            });
            this._persionStep = new dNumberStep(this.$el.find('.js-pnum'));
            this._persionStep.setOpt({
                onChange: function(num){
                    self.model.set('personCount', num);
                }
            });

            this.embedHeader({
                titleHtml: title,
                moreHtml: '<span style="margin-left: -1.3rem">计费规则</span>',
                back: true,
                listener: {
                   moreHandler: function(){}
                }
            });

            this.els = {
                departureDate: this.$el.find('.js-departureDate')
            }
        },

        onLoad: function(){
            new dDateTimeScroll( this.els.departureDate, {
                type: 'datetime'
            });
        },

        onHide: function(){

        },

        bindings: {

        }
    });

    return View;
});