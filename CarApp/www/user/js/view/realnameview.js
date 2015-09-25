define(['dView', 'dBridge', 'h5upload'], function(dView, dBridge, h5upload){
    var View = dView.extend({
        events: {
            'click .js-upload': function(){
                dBridge.pictureFromCamera(function(data){
                    alert(data);
                }, function(e){
                    alert(e)
                });
            },
            'click .js-camera': function(){
                dBridge.pictureFromPhotolibrary(function(data){
                    alert(data);
                }, function(e){
                    alert(e)
                });
            }
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

        },

        onHide: function(){

        },

        save: function(){
            Ancients.forward('addcar.html');
        },

        bindings: {
            '#js-nickName': 'nickName',
            '#js-name': 'name',
            '#js-portrait': 'portrait',
            '#js-license': 'drivingLicense',
            '#js-drivingPhoto': 'drivingPhoto'
        }
    });

    return View;
});