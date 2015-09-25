define(['dCordova'], function(dCordova) {
    var bridge = {
        deviceInfo: function () {
            return device;
        },
        pictureFromCamera: function(success, error){
            var camera = navigator.camera;

            camera.getPicture(function(data){
                success('data:image/jpeg;base64,'+data);
            },function(e){
                error(e);
            },{
                destinationType:camera.DestinationType.DATA_URL,
                sourceType:camera.PictureSourceType.CAMERA,
                allowEdit:false,
                targetWidth:135,
                targetHeight:200
            });
        },
        pictureFromPhotolibrary: function(){
            navigator.camera.getPicture(function(data) {
                success('data:image/jpeg;base64,'+data);
            },function(e){
                error(e);
            }, {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: false,
                targetWidth: 135,
                targetHeight: 200,
                mediaType: Camera.MediaType.PICTURE
            });
        }
    };

    return bridge;
});