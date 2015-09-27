define(['dView', 'dBottomPopLayer', 'dConfirmPopLayer'], function(dView, dBottomPopLayer, dConfirmPopLayer){
    var View = dView.extend({
        events: {
            'click .add-file-item': 'takePicture',
            'click .delete-img': 'deleteImg'
        },

        onCreate: function(){
            var self = this;

            this.$el.append(this.T['js-realname-wrap']);
            this.embedHeader({
                titleHtml: '实名登记',
                moreHtml: '下一步',
                back: true,
                listener: {
                    backHandler: function(){
                        Ancients.back('login.html');
                    },
                    moreHandler: self.save
                }
            });

        },

        onLoad: function(){
            if(!this.photoPop) {
                this.photoPop = new dBottomPopLayer();

                this.photoPop.setOpt({
                    root: 'body',
                    onsuccess: $.proxy(this.photoCB.success, this),
                    onerror: $.proxy(this.photoCB.error, this)
                });
            }
        },

        onHide: function(){

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
//            '#js-portrait': 'portrait',
            '#js-license': 'drivingLicense'
//            '#js-drivingPhoto': 'drivingPhoto'
        },

        photoCB: {
            success: function(base64, triggerDOM){
                triggerDOM.removeClass('add-file-item').addClass('file-item');
                triggerDOM.html('<img class="upload-img" src="' + base64 + '"></img><div class="delete-img"></div>');
            },
            error: function(error, triggerDOM){
                this.showToast(error);
            }
        },

        deleteImg: function(){
            if(!this.confirmLayer){
                this.confirmLayer = new dConfirmPopLayer();
                this.confirmLayer.setOpt({
                    title: '您确定要删除此张图片吗?',
                    root: 'body',
                    onsure: function(){
debugger
                    }
                });
            }

            this.confirmLayer.show();
        }
    });

    return View;
});