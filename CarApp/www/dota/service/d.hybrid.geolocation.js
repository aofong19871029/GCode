/**
 * 定位功能
 */

define(['dCordova', 'dValidate', 'dAjax', 'dStore'], function (cordova, dValidate, dAjax, dStore) {
    var isAndroid = Ancients.isAndroid,
        isIOS = Ancients.isIOS,
        win = window,
        noop = $.noop,
        baiduAk = 'WtFOgzR7MS7qcSiGBuX35SmR',
        GeoAPI = {},
        baiduStatusCode = {
            '0': '正常',
            '1': '请求参数非法',
            '2': '请求参数非法',
            '3': '权限校验失败',
            '4': '配额校验失败',
            '5': 'ak不存在或者非法',
            '101': '服务禁用',
            '102': '不通过白名单或者安全码不对',
            '2xx': '无权限',
            '3xx': '配额错误'
        },
        getBaiduErrorByCode = function(status){
            var errorMsg;

            if(baiduStatusCode[status]){
                errorMsg = baiduStatusCode[status];
            }
            else if(status.length === 3){
                switch (status.charAt(0)){
                    case '2':
                        errorMsg = baiduStatusCode['2xx'];
                        break;
                    case '3':
                        errorMsg = baiduStatusCode['3xx'];
                        break;
                }
            }

            return errorMsg;
        },
        geoStore = new dStore({
            key: 'geolocation',
            expir: '30D'
        }),
        timer;


    /**
     * 逆地址解析
     * 经纬度转为baidu 地址信息 {"location":{"lng":116.32298703399,"lat":39.983424051248},"formatted_address":"北京市海淀区中关村大街27号1101-08室","business":"中关村,人民大学,苏州街","addressComponent":{"city":"北京市","country":"中国","direction":"附近","distance":"7","district":"海淀区","province":"北京市","street":"中关村大街","street_number":"27号1101-08室","country_code":0},"poiRegions":[],"sematic_description":"北京远景国际公寓(中关村店)内0米","cityCode":131}
     * @param pos 经度 纬度
     * @param success
     * @param error
     */
    GeoAPI.reversePosition = function(pos, success, error){
        !dValidate.isFunction(success) && (success = noop);
        !dValidate.isFunction(error) && (error = noop);

        Ancients.reversePosition = function(obj){
            var status = obj.status + '',
                errorMsg = getBaiduErrorByCode(status);


            if(errorMsg) {
                error({status: status, message: errorMsg});
            } else{
                success(obj);
            }
        };

        dAjax.js('http://api.map.baidu.com/geocoder/v2/?ak=' + baiduAk + '&callback=Ancients.reversePosition&location=' + [pos.latitude, pos.longitude].join(',') + '&output=json&pois=0', function(){
            error({status:404, message:'服务无返回'});
        });
    };

    /**
     * 关键字地理查询
     * @param query 关键字
     * @param query 所属城市/区域名称或代号
     * @param success
     * @param error
     */
    GeoAPI.placeSuggestion = function(query, region, success, error){
        var storeCityCode = geoStore.getAttr('cityCode');

        !dValidate.isFunction(success) && (success = noop);
        !dValidate.isFunction(error) && (error = noop);

        if(arguments.length === 3 && dValidate.isFunction(region) && storeCityCode){
            region = storeCityCode;
        }

        if(dValidate.isEmpty(region)){
            return error({status: 220, message: 'region(城市代号) 不可为空'});
        }

        dAjax.get('http://api.map.baidu.com/place/v2/suggestion', {
            query: encodeURIComponent(query),
            region: region,
            output: 'json',
            ak: baiduAk
        }, function(obj){
            var status = obj.status + '',
                errorMsg = getBaiduErrorByCode(status);


            if(errorMsg) {
                error({status: status, message: errorMsg});
            } else{
                success(obj);
            }
        }, function(){
            error({status:404, message:'服务无返回'});
        })
    };

    if (isAndroid) {
        GeoAPI._getCurrentPosition = function (success, error) {
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
                        case '68':
                            error('网络连接失败');
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
        GeoAPI._getCurrentPosition = function(success, error){
            !dValidate.isFunction(success) && (success = noop);
            !dValidate.isFunction(error) && (error = noop);

            navigator.geolocation.getCurrentPosition(
                function(pos){
                    success(pos.coords);
                },
                function(err) {
                    error(err.message);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 180000
                });
        }
    }

    /**
     * 获取时时定位信息
     * 如果没有就返回null 即失败
     * @returns {*}
     */
    GeoAPI.getCurrentPosition = function(){
        var storePos = geoStore.get();

        if(storePos && storePos.location && storePos.address && storePos.cityCode){
            return {
                location: storePos.location,
                address: storePos.address,
                cityCode: storePos.cityCode
            };
        }

        return null
    };

    /**
     * 每3分钟定位一次
     * 获取手机所处位置的经纬度，城市信息，地址
     */
    function timerLocation(){
        var lastPos = geoStore.getAttr('location'),
            time = 180000;

        // 获取手机地址经纬度
        GeoAPI.getCurrentPosition(function(obj){
            geoStore.setAttr('oldlocation', lastPos);
            geoStore.setAttr('location', obj);

            // 根据经纬度逆解析 得到 address 和 cityCode
            GeoAPI.reversePosition(obj, function(json){
                var result = json.result,
                    address = result.formatted_address,
                    cityCode = result.cityCode;

                geoStore.setAttr('address', address);
                geoStore.setAttr('cityCode', cityCode);

                timer = setTimeout(timerLocation, time);
            }, function(){
                timer = setTimeout(timerLocation, time);
            });
        }, function(){
            timer = setTimeout(timerLocation, time);
        });
    }
    timerLocation();

    Ancients.stores.geoStore = geoStore;

    return GeoAPI;
});