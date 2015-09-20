define(['dCordova'], function(dCordova) {
    var bridge = {
        deviceInfo: function () {
            return device;
        }
    };

    return bridge;
});