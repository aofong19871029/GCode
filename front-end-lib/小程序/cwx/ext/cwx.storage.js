/**
 * 新版设计保留了对于wx.storage的无缝侵入，只是做了createTime的附加，方便回收数据，走cwx.storage可以方案读写，内部持久化由框架同学维护
 * 基于cwx.storage.set/get/remove的数据，换成wx.storage依然可以执行，无损
 * @module cwx/storage
 */
var __global = require('./global.js');
var storage = __global.__mirrorStorage = {};

var record = {};
var syncJob = [];
var badJob = [];
var busWhiteList = [
	'BUS_UTMSOURCE', //地推参数
	'BUS_MASK_TIP_DESK', //蒙层提示次数，清除会导致多弹蒙层
	'BUS_MASK_TIP_CODE',
	'BUS_STATIONS_SAVETIME', //清除会导致出发城市缓存不能更新
	'BUS_HISTORY_FROM',
	'BUS_HISTORY_TO',
	'BUS_HISTORY_LIST',
];
var whiteList = ['clientID', 'ABTestingManager', 'cwx_market_new', 'GS_HOME_HISTORY_CACHE', 'GS_DISTRICT_TYPE_INFO_CACHE', 'GS_DISTRICT_NEW_USER_GUIDE_CACHE', 'GS_DISTRICT_LIST_CACHE', 'GS_SEARCH_HISTORIES_CACHE', 'GS_HOT_DISTRICTS_CACHE', 'P_HOTEL_SESSIONID', 'mkt_union', 'mkt_bargain_stopOnShow', 'P_HOTEL_BOOKROOMDATA', 'HOTEL.ROOM.TRACEID', 'P_HOTEL_COUPON_LAYER', 'P_HOTEL_DETAIL_FILTER', 'minpPriceInfo', 'P_HOTEL_LIST_QMJ_COUPON', 'hotelCities', 'P_HOTEL_SELECTED_CITY', 'P_HOTEL_CITY_HISTORY_INLAND', 'P_HOTEL_CITY_HISTORY_OVERSEA', 'P_HOTEL_OVERSEA_ADDRESS', 'P_HOTEL_CITY'];
var limit = 10;
var recordStoreKey = 'cwx.storage.recorad';
var timeout,badTimeout;
var notInit = true;
var manageStorage = {
	init : function() {
		record = JSON.parse(wx.getStorageSync(recordStoreKey) || '{}') || record;
		notInit = false;
	},
	/**
	 * @function
	 * @name set
	 * @param {*} key 
	 * @param {*} data 
	 */
	set : function(key, data) {
		var t = (+(new Date()) + '');
		record[key] = t;
		storage[key] = data;
		syncJob.push(key);
		this._updateRecord();
	},
	/**
	 * @function
	 * @name remove
	 * @param {*} key 
	 * @param {*} data 
	 */
	remove : function(key, data) {
		delete record[key];
		delete storage[key];
		wx.removeStorageSync(key);
		// syncJob.push(key);
		this._updateRecord();
	},
	/**
	 * @function
	 * @name get
	 * @param {*} key 
	 */
	get : function(key) {
		if (key in storage) {
			return storage[key]
		} else {
			var v = wx.getStorageSync(key);
			if (v) {
				storage[key] = v;
			}
			return v;
		}
	},
	/**
	 * 同步storage
	 * @function
	 * @name _updateRecord
	 */
	_updateRecord : function() {
		var self = this;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			var key, lastKey;
			// 先做syncJob
			while (key = syncJob.pop()) {
				if (key != lastKey) {
					if (key in storage) {
						try {
							wx.setStorageSync(key, storage[key]);
						} catch (e) {
							// 挂的丢badJob
							badJob.push(key);
						}
					} else {
						// wx.removeStorageSync(key);
					}
				}
				lastKey = key;
			}
			// badJob延后，因为可能syncJob会有remove，这时候说不定就可以set了
			if (badJob && badJob.length) {
				clearTimeout(badTimeout);
				badTimeout = setTimeout(function() {
					while (key = badJob.pop()) {
						try {
							wx.setStorageSync(key, storage[key]);
						} catch (e) {
							// 看来之前没有remove，还是满的
							self._cleanStore();
							try {
								wx.setStorageSync(key, storage[key]);
							} catch (e1) {
								// 看来没有createTime可以删除的
								self._forceCleanStore();
								// 因为forceClean是异步操作，要先把这次取出来
								// 但是没有持久化的key丢回去badJob
								badJob.push(key);
								break;
							}
						}
					}
				}, 200)
			}
		}, 200);
	},
	/**
	 * 按照记录时间
	 * @function
	 * @name _cleanStore
	 */
	_cleanStore : function() {
		var a = [];
		for ( var k in record) {
			a.push(record[k] + k);
		}
		a = a.sort(function(a, b) {
			// 时间早的排前面
			return parseFloat(a.substring(0, 13)) - parseFloat(b.substring(0, 13));
		});
		for (var i = 0,j=0; i < a.length; i++) {
			var v = a[i];
			var k = v.substring(13);
			if (whiteList.indexOf(k) == -1) {
				delete record[k];
				delete storage[k];
				wx.removeStorageSync(k);
				j++;
			}
			if(j > limit){
				break;
			}
		}
	},
	/**
	 * 在没有记录createtime时候按照value length大小从大到小删除limit个
	 * @function
	 */
	_forceCleanStore : function() {
		var self = this;
		try {
			var info = wx.getStorageInfoSync()
			var keys = info.keys;
			var a = [], l = keys.length;
			for (var i = 0; i < l; i++) {
				var key = keys[i];

				var length = 0;
				var v = wx.getStorageSync(key);
				if (typeof (v) == 'string') {
					length = v.length;
				} else {
					length = JSON.stringify(v).length;
				}
				a.push({
					key : key,
					length : length
				})

				if (i == l - 1) {
					a = a.sort(function(a, b) {
						// 大的排前面
						return b.length - a.length
					});
					for (var i = 0, j=0; i < a.length;i++) {
						var k = a[i].key;
						if (whiteList.indexOf(k) == -1) {
							delete record[k];
							delete storage[k];
							wx.removeStorageSync(k);
							j++;
						}
						if(j > limit){
							break;
						}
					}
					// 在forceJob异步的最后异步里面，从新持久化
					self._updateRecord();
				}

			}
		} catch (e) {
			// Do something when catch error
		}

	}
};
if (notInit) {
	manageStorage.init();
}

module.exports = manageStorage;
