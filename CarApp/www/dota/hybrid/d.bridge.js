define(['dCordova'], function(dCordova) {
    var bridge = {
        init: function () {
        },
        deviceInfo: function () {
            return device;
        }
    };
    document.addEventListener('deviceready', bridge.init, false);

    return bridge;
});