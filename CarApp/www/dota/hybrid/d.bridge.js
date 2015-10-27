if(Ancients.isApp) {
    define(['dCordova', 'dHybridCamera', 'dHybridGeo', 'dValidate'], function (cordova, camera, dHybridGeo, dValidate) {
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
            },
            reversePosition: dHybridGeo.reversePosition,
            placeSuggestion: dHybridGeo.placeSuggestion,
            getCurrentPosition: dHybridGeo.getCurrentPosition
        };

        return bridge;
    });
}
else if(Ancients.isH5){
    define(['dHybridGeo'], function (dHybridGeo) {
        var bridge = {
            pictureFromCamera: $.noop,
            pictureFromPhotolibrary: $.noop,
            imei: function () {
                return '';
            },
            photoNumber: $.noop,
            reversePosition: dHybridGeo.reversePosition,
            placeSuggestion: dHybridGeo.placeSuggestion,
            getCurrentPosition: dHybridGeo.getCurrentPosition
        };

        return bridge;
    });
}