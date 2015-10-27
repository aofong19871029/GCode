/**
 * app 相机，相册功能
 */

define([], function () {
    var CameraAPI = {
        pictureFromCamera: function (success, error) {
            navigator.camera.getPicture(function (data) {
                success('data:image/jpeg;base64,' + data);
            }, function (e) {
                error(e);
            }, {
                destinationType: navigator.camera.DestinationType.DATA_URL,
                sourceType: navigator.camera.PictureSourceType.CAMERA,
                allowEdit: false,
                targetWidth: 135,
                targetHeight: 200
            });
        },
        pictureFromPhotolibrary: function (success, error) {
            navigator.camera.getPicture(function (data) {
                success('data:image/jpeg;base64,' + data);
            }, function (e) {
                error(e);
            }, {
                destinationType: navigator.camera.DestinationType.DATA_URL,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: false,
                targetWidth: 135,
                targetHeight: 200,
                mediaType: navigator.camera.MediaType.PICTURE
            });
        }
    };

    return CameraAPI;
});