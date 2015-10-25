if(Ancients.isApp) {
    define(['dCordova', 'dHybridCamera', 'dValidate'], function (cordova, camera, dValidate) {
        var bridge = {
            pictureFromCamera: camera.pictureFromCamera,
            pictureFromPhotolibrary: camera.pictureFromPhotolibrary,
            imei: function () {
                return device['imei'];
            },
            photoNumber: function(success, error){
                !dValidate.isFunction(success) && (success = noop);
                !dValidate.isFunction(error) && (error = noop);

                window.plugins.phonenumber.get(success, error);
            }
        };

        return bridge;
    });
}
else if(Ancients.isH5){
    define(function () {
        var bridge = {
            pictureFromCamera: $.noop,
            pictureFromPhotolibrary: $.noop,
            imei: function () {
                return '';
            },
            photoNumber: function(){

            }
        };

        return bridge;
    });
}