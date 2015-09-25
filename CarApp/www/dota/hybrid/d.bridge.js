define(['dCordova'], function(dCordova) {
    var bridge = {
        deviceInfo: function () {
            return device;
        },
        pictureFromCamera: function(success, error){
            navigator.camera.getPicture(function(data){
                success('data:image/jpeg;base64,'+data);
            },function(e){
                error(e);
            }, {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                targetWidth: 135,
                targetHeight: 200
            });
        },
        pictureFromPhotolibrary: function(success, error){
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