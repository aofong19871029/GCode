define(['dView', 'dCalendar', 'dDate', 'dCameraPopLayer', 'userStore'], function(dView, dCalendar, dDate, dCameraPopLayer, userStore){
    var View = dView.extend({
        events: {
            'click .js-time': 'selectInvoiceDeadline',
            'click .js-camera': 'takePicture',
            'click .delete-img': 'deleteImg'
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
            if(!this.photoPop) {
                this.photoPop = new dCameraPopLayer();

                this.photoPop.setOpt({
                    root: 'body',
                    onsuccess: $.proxy(this.photoCB.success, this),
                    onerror: $.proxy(this.photoCB.error, this)
                });
            }

            alert(JSON.stringify(userStore.realNameStore.get()));
        },

        onHide: function(){
            this.confirmLayer && this.confirmLayer.destory();
            this.photoPop && this.photoPop.destory();
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
        },

        takePicture: function(){
            this.photoPop.show();
        },

        photoCB: {
            success: function(base64, triggerDOM){
                triggerDOM.removeClass('add-file-item').addClass('file-item');
                triggerDOM.html('<img class="upload-img" src="' + base64 + '"></img><div class="delete-img"></div>');

                this.model.set(triggerDOM.attr('data-bind'), base64);
            },
            error: function(error, triggerDOM){
                this.model.set(triggerDOM.attr('data-bind'), '');
                this.showToast(error);
            }
        },

        deleteImg: function(e){
            var self = this,
                target = $(e.currentTarget),
                container = target.parent(),
                binding = container.attr('data-bind');

            if(!this.confirmLayer){
                this.confirmLayer = new dConfirmPopLayer();
                this.confirmLayer.setOpt({
                    title: '您确定要删除此张图片吗?',
                    root: 'body'
                });
            }

            this.confirmLayer.resetOpt({
                onsure: function(){

                    container.removeClass('file-item').addClass('add-file-item').empty();

                    self.model.set(binding, '');
                }
            });

            this.confirmLayer.show();
        }
    });

    return View;
});