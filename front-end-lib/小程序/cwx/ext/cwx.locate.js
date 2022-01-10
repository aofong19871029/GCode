/**
 * @name locate
 * @module cwx/locate
 */

var __global = require('./global.js')
var cwx = __global.cwx;


var locate = {};
var __kMaxAddressCacheTime = 2 * 60;
var __kMaxCtripCityCacheTime = 10 * 60;

var _cachedGeoPoint = null;
var _cachedAddress = null;
var _cachedCtripCity = null;

//add a callback queue, fix showAlert more times
var GeoPointQueue = [];
var GeoPointDidStart = false;
var UserNotAllow = false;

function _queryCtripCity(latitude, longitude, callback) {
	var source = '', openid = '';
	try {
		source = cwx._wxGetCurrentPages[0].__route__;
	} catch (e) {
	}
	try {
		openid = cwx.cwx_mkt.openid;
	} catch (e) {
	}
	cwx.request({
		//url: "/restapi/soa2/10398/json/LBSLocateCity",
		url: "/restapi/soa2/12378/json/lBS",
		method: "POST",
		/*data: {
				Latitude: latitude,
				Longitude: longitude,
				Language: "CN"
		},*/
		data: {
			"appId": '5003',
			"coordType": "GCJ02",
			"head": {},
			"isNeedCityID": true,
			"language": "zh-cn",//之前传递是CN现在改成zh-cn
			"latitude": latitude,
			"longitude": longitude,
			"type": 1,
			"source": source,
			"extension": {
				"openid": openid
			}
		},
		success: function (res) {
			//console.log("_queryCtripCity res = ",JSON.stringify(res));
			_cachedCtripCity = res;
			_cachedCtripCity.cachedDate = new Date();
			if (res && res.data && res.data.pOIInfo && res.data.pOIInfo.longitude) {
				Object.assign(res.data, {
					"CityLongitude": res.data.pOIInfo.longitude,
					"CityLatitude": res.data.pOIInfo.latitude,
					"CountryName": res.data.pOIInfo.country,
					"CityEntities": res.data.ctripPOIInfo.cityIDList.map(function (i) {
						i.CityName = i.cityName;
						i.CityID = i.cityID;
						return i;
					}),
					/*[ {
						"CityName" : res.ctripPOIInfo.districtName,
						"CityID" : res.ctripPOIInfo.districtID
					} ],*/
					"LBSType": res.data.ctripPOIInfo.lbsType,
					"DistrictId": res.data.ctripPOIInfo.districtID,
				})
				if (callback) {
					callback(res)
				}
			} else {
				if (callback) {
					var cbData = {};
					cbData.error = "Request_Ctrip_City_Failed";
					callback(cbData);
				}
				console.log("fail for ctrip city");
			}

		},
		fail: function () {
			if (callback) {
				var cbData = {};
				cbData.error = "Request_Ctrip_City_Failed";
				callback(cbData);
			}
			console.log("fail for ctrip city");
		},
		timeoutSecond: 10000 //只针对socket起作用，http目前没做timeoutFail
	});
}

/**
 * @function
 * @return {point}
 */
function getCachedGeoPoint() {
	if (_cachedGeoPoint && _cachedGeoPoint.cachedDate) {
		var interval = new Date().getTime() / 1000 - _cachedGeoPoint.cachedDate.getTime() / 1000;
		if (interval < __kMaxAddressCacheTime) {
			return _cachedGeoPoint;
		}
	}

	return null;
}

/**
 * @function
 * @return {point}
 */
function getCachedAddress() {
	if (_cachedAddress && _cachedAddress.cachedDate) {
		var interval = new Date().getTime() / 1000 - _cachedAddress.cachedDate.getTime() / 1000;
		if (interval < __kMaxAddressCacheTime) {
			return _cachedAddress;
		}
	}

	return null;
}

/**
 * @function
 * @return {point}
 */
function getCachedCtripCity() {
	if (_cachedCtripCity && _cachedCtripCity.cachedDate) {
		var interval = new Date().getTime() / 1000 - _cachedCtripCity.cachedDate.getTime() / 1000;
		if (interval < __kMaxCtripCityCacheTime) {
			return _cachedCtripCity;
		}
	}

	return null;
}

/**
 * @function
 * @param {map} cbData
 */
function startGetGeoPoint(cbData) {
	wx.getSetting({
		success: function (res) {
			if (res.authSetting['scope.userLocation']) {
				UserNotAllow = false;

			}
			then();
		},
		fail: function () {
			then();
		}
	})

	function then() {
		if (UserNotAllow) {
			// console.log('用户拒绝获取定位权限');
			if (cbData.fail) {
				cbData.fail({
					errMsg: 'getLocation:fail auth deny'
				})
			}
			return;
		}
		//if start ,add queue
		if (GeoPointDidStart) {
			GeoPointQueue.push(cbData);
			// console.log('入栈定位请求 ： ',GeoPointQueue.length);
			return;
		}
		GeoPointDidStart = true;

		var oSuccess = cbData.success;
		var oFail = cbData.fail;
		var onComplete = cbData.complete;

		var qSuccess = function (res) {
			for (var i = 0; i < GeoPointQueue.length; i++) {
				var ob = GeoPointQueue[i];
				if (ob && ob.success) {
					ob.success(res);
				}
			}
		}

		var qFail = function (res) {
			for (var i = 0; i < GeoPointQueue.length; i++) {
				var ob = GeoPointQueue[i];
				if (ob && ob.fail) {
					ob.fail(res);
				}
			}
		}


		var qComplete = function (res) {
			for (var i = 0; i < GeoPointQueue.length; i++) {
				var ob = GeoPointQueue[i];
				if (ob && ob.complete) {
					ob.complete(res);
				}
			}
			// remove all
			GeoPointQueue.splice(0, GeoPointQueue.length);
			// console.log('秦秋 醋蘸');
		}
		var nSuccess = function (res) {
			_cachedGeoPoint = res;
			_cachedGeoPoint.cachedDate = new Date();
			if (oSuccess) {
				oSuccess(res);
			}
			qSuccess(res);
		}

		var nFail = function (res) {
			console.log('res = ', res);
			//用户不允许
			if (res && res.errMsg === 'getLocation:fail auth deny') {
				UserNotAllow = true;
			}
			var cbData = {};
			cbData.error = "GET_GEO_FAILED";
			cbData.errMsg = res && res.errMsg || "";
			if (oFail) {
				oFail(cbData);
			}
			qFail(res);
		}
		var nComplete = function (res) {
			GeoPointDidStart = false;
			if (onComplete) {
				onComplete(res)
			}
			qComplete(res);
		}
		wx.getLocation({
			type: 'wgs84',
			success: nSuccess,
			fail: nFail,
			complete: nComplete
		});
	}

}

function _getAddress(latitude, longitude, callback, timeout, coordType) {
	var cbData = {};
	cbData.latitude = latitude;
	cbData.longitude = longitude;
	var url = "/restapi/soa2/12378/json/reverseAddress";
	var requestData = {
		"Location": latitude + "," + longitude,
		"pois": 1,
		"CoordType": coordType || 'wgs84ll',
	}
	var reqObj = {
		url: url,
		method: "POST",
		data: requestData,
		success: function (res) {
			// console.log( "逆地址解析：", res );
			var data = res.data;
			if (res.statusCode == 200 && data) {

				if (data.ResponseStatus && data.ResponseStatus.Ack === "Success") {
					cbData.address = data.formattedAddress;
					cbData.location = data.location;
					cbData.cityName = data.addressComponent.city;
					var keys = Object.getOwnPropertyNames(data)
					keys.forEach(function (value, index) {
						cbData[value] = data[value]
					})

					_cachedAddress = cbData;
					_cachedAddress.cachedDate = new Date();
				} else {
					cbData.error = "Request_Address_Error(" + (data.ResponseStatus || "") + ")";
				}
			}
			else {
				cbData.error = "Request_Address_Error(HTTP_" + res.statusCode + ")";
			}
			if (callback) {
				// console.log("callback cb = ",JSON.stringify(cbData));
				callback(cbData);
			}
		},
		fail: function () {
			cbData.error = "Request_Address_Failed";
			if (callback) {
				callback(cbData);
			}
		}
	};

	if (typeof timeout === "number") {
		reqObj.timeoutSecond = timeout;
	}

	cwx.request(reqObj);
}

/**
 * @function
 * @param {function} callback
 * @param {number} request timeout
 */
function startGetAddress(callback, timeout) {
	var cbData = {};
	startGetGeoPoint({
		type: 'wgs84',
		success: function (res) {
			var latitude = res.latitude
			var longitude = res.longitude
			_getAddress(latitude, longitude, callback, timeout)
		},
		fail: function () {
			cbData.error = "Read_GeoPoint_Failed";
			if (callback) {
				callback(cbData);
			}
		}
	});
}

/**
 * @function
 * @param {function} callback
 */
function startGetCtripCity(callback) {
	var cbData = {};
	startGetGeoPoint({
		type: 'wgs84',
		success: function (res) {
			var latitude = res.latitude
			var longitude = res.longitude
			_queryCtripCity(latitude, longitude, callback);
		},
		fail: function () {
			cbData.error = "Read_GeoPoint_Failed";
			if (callback) {
				callback(cbData);
			}
		}
	})
}

/**
 * @function
 * @param {number} latitude
 * @param {number} longitude
 * @param {function} callback
 */
function startGetCtripCityByCoordinate(latitude, longitude, callback) {
	_queryCtripCity(latitude, longitude, callback);
}

/**
 * @function
 * @param {number} latitude
 * @param {number} longitude
 * @param {function} callback
 */
function startGetAddressByCoordinate(latitude, longitude, callback, coordType) {
	_getAddress(latitude, longitude, callback, null, coordType); //此处需要兼容timeout没有的情况
}


//public API to export

//获取当前经纬度，调用微信定位
locate.startGetGeoPoint = startGetGeoPoint;
//获取当前地址，调用微信定位，并且从百度做逆地址解析
locate.startGetAddress = startGetAddress;
//获取当前携程城市，根据经纬度，到携程服务器去查询当前城市
locate.startGetCtripCity = startGetCtripCity;
// 根据传入经纬度，查询对应城市信息
locate.startGetCtripCityByCoordinate = startGetCtripCityByCoordinate;
locate.startGetAddressByCoordinate = startGetAddressByCoordinate;
//获取缓存的经纬度信息, 2min过期
locate.getCachedGeoPoint = getCachedGeoPoint;
//获取缓存的地址信息, 2min过期
locate.getCachedAddress = getCachedAddress;
//获取缓存的携程城市，10min过期
locate.getCachedCtripCity = getCachedCtripCity;

module.exports = locate;
