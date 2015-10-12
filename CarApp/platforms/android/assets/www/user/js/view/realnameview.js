define(['dView', 'dCameraPopLayer', 'dConfirmPopLayer', 'userStore'], function(dView, dCameraPopLayer, dConfirmPopLayer, userStore){
    var View = dView.extend({
        events: {
            'click .add-file-item': 'takePicture',
            'click .delete-img': 'deleteImg'
        },

        onCreate: function(){
            this.$el.append(this.T['js-realname-wrap']);
            this.embedHeader({
                titleHtml: '实名登记',
                moreHtml: '下一步',
                back: true,
                listener: {
                    backHandler: function(){
                        Ancients.back('login.html');
                    },
                    moreHandler: this.save.bind(this)
                }
            });

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
        },

        onHide: function(){
            this.confirmLayer && this.confirmLayer.destory();
            this.photoPop && this.photoPop.destory();

            userStore.realNameStore.set(this.model.get());
        },

        save: function(){
            Ancients.forward('addcar.html');
        },

        takePicture: function(e){
            this.photoPop.show($(e.currentTarget));
        },

        bindings: {
            '#js-nickName': 'nickName',
            '#js-name': 'name',
            '#js-license': 'drivingLicense'

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