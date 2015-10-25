/**
 * 定位功能
 */

define(['dCordova', 'dValidate'], function (cordova, dValidate) {
    var isAndroid = Ancients.isAndroid,
        isIOS = Ancients.isIOS,
        win = window,
        noop = $.noop,
        GeoAPI = {};

    if (isAndroid) {
        GeoAPI.getCurrentPosition = function (success, error) {
            !dValidate.isFunction(success) && (success = noop);
            !dValidate.isFunction(error) && (error = noop);

            var statusCode = {
                    '61': "GPS定位结果",
                    '62': '扫描整合定位依据失败。此时定位结果无效',
                    '63': '网络异常，没有成功向服务器发起请求。此时定位结果无效',
                    '65': '定位缓存的结果',
                    '66': '离线定位结果。通过requestOfflineLocaiton调用时对应的返回结果',
                    '67': '离线定位失败。通过requestOfflineLocaiton调用时对应的返回结果',
                    '68': '网络连接失败时，查找本地离线定位时对应的返回结果',
                    '161': '表示网络定位结果'
                },
                callback = function (pos) {
                    var code = pos.code + '';

                    switch (code) {
                        case '62':
                        case '63':
                            error(statusCode[code]);
                            break;
                        default :
                            success(pos.coords); // {latitude: 纬度, longitude: 经度}
                            break;
                    }

                    win.locationService.stop(noop, noop);
                };

            win.locationService.getCurrentPosition(callback, callback);
        };
    }
    //IOS, H5
    else {
        GeoAPI.getCurrentPosition = function(success, error){
            !dValidate.isFunction(success) && (success = noop);
            !dValidate.isFunction(error) && (error = noop);
        }
    }

    return GeoAPI;
});