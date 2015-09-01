define(['dView', 'dCalendar', 'dDate'], function(dView, dCalendar, dDate){
    var View = dView.extend({
        events: {
            'click .js-time': 'selectInvoiceDeadline'
        },

        onCreate: function(){
            this.$el.append(this.T['js-addcar-wrap']);

            this.embedHeader({
                titleHtml: '新增车辆',
                moreHtml: '完成',
                back: true,
                listener: {
                    backHandler: function () {
                        Ancients.back('realname.html');
                    },
                    moreHandler: function () {

                    }
                }
            });

            this.els = {
                selectDate: this.$el.find('#js-select-date')
            };
        },

        onLoad: function(){

        },

        onHide: function(){

        },

        bindings: {
            "#js-select-date": {
                "observe": "insureDate",
                "getVal": function($el) {
                    return $el.text() === '选择日期' ? null : $el.text();
                },
                "update": function($el, val, model, options) {
                    var date = model.get('insureDate');
                    $el.text(date || '选择日期')
                }
            },
            '#J_brand': 'brandId',
            '#J_model': 'modelId',
            '#js-carPhoto': 'carPhoto',
            '#js-carId': 'carId',
            '#js-engineNum': 'engineNum'
        },

        selectInvoiceDeadline: function(){
            var self = this;

            if(!this.calendar) {
                this.calendar = new dCalendar();
            }

            this.calendar.setOpt({
                getVal: function (val) {
                    self.els.selectDate.text(val);
                },
                title: '保险到期时间',
                selectedDate: new dDate().toShortDateString()
            });

            this.calendar.show();
        }
    });

    return View;
});