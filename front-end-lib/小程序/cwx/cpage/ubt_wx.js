/**
 * @module cwx\ubt_wx
 */
var __global = require('../ext/global.js');
var UZip = require('../ext/uzip');
var cwx = __global.cwx || {};

var VERSION = '3.1.1';
var STORAGE_KEY = 'CTRIP_UBT_M';
var SESSION_MAX_LIEFTIME = 1800000;
var SDK_AGENT_ENV = 'weixin';
var noop = function () { }

// var cwxscoket = require('../ext/cwx.socket.js');
//获取开关需要等CID，改代码造成载入卡顿
//希望添加到CID服务返回之后~ tczhu
// cwx.request({
//   url: '/restapi/soa2/10290/GetConfigData.json?category=ubt-wechat&ver=1.0&rev=-1&format=json',
//   method: "GET",
//   success: function(res){
//     if (res.statusCode == 200 && res.data){
//       res = res.data.Result;
//       try{
//         res = JSON.parse(res);
//         useSocket = res.properties.websocket;
//       }catch(e){}
//     }
//   }
// })
var useSocket = 0;

var cwxscoket = require('../ext/cwx.socket.js');

if (cwx.clientID && cwx.clientID.length) {
	isUseSocket();
} else {
	cwx.Observer.addObserverForKey('CIDReady', function () {
		isUseSocket();
	})
}
function isUseSocket() {
	//console.error(cwx.clientID);
	var url = 'https://m.ctrip.com/restapi/socketio/abService/getConfig?version=4&cwxClientId=' + cwx.clientID;
	if (__global.env.toLowerCase() === 'uat') {
		url = 'https://gateway.m.fws.qa.nt.ctripcorp.com/restapi/socketio/abService/getConfig?version=4&cwxClientId=' + cwx.clientID;
		//console.error('uat');
	}
	wx.request({
		url: url,
		method: "GET",
		success: function (res) {
			if (res.statusCode == 200 && res.data) {
				res = res.data;
				//console.error(res);
				try {
					if (typeof (res) == 'string') {
						res = JSON.parse(res);
					}
					//console.error(res);
					useSocket = res.ABTesting;
					if (useSocket == 0 || useSocket == 'False' || useSocket == '0') {
						cwx._useSocket = '0';
						wx.setStorageSync('globalUseSocket', '0');
					} else {
						cwx._useSocket = '1';
						wx.setStorageSync('globalUseSocket', '1');
					}
					//useSocket = 0;
				} catch (e) {
					console.error(e);
				}
			}
		}
	})
}


var Y = {
	_data_: {},

	now: function () {
		return new Date().getTime()
	},

	isNStr: function (obj) {
		var t = typeof obj;
		return obj && (t === "number" || t === "string" || t === 'boolean');
	},

	isNumeric: function (obj) {
		var t = typeof obj;
		return (t === "number" || t === "string") && !isNaN(obj - parseFloat(obj));
	},

	makeSlice: function (l, v) {
		var arr = [];
		for (var i = 0; i < l; i++) {
			arr[i] = v;
		}
		return arr;
	},

	hash: function (str) {
		var h = 1, c = 0;
		if (str) {
			h = 0;
			for (var i = str.length - 1; i >= 0; i--) {
				c = str.charCodeAt(i);
				h = (h << 6 & 268435455) + c + (c << 14);
				c = h & 266338304;
				h = c != 0 ? h & c >> 21 : h;
			}
		}
		return h;
	},
	random: function () {
		return ("" + Math.random()).slice(-8);
	},
	uniqueID: function () {
		return Y.random() ^ Y.now() & 2147483647;
	},
	check_tags: function (tag) {
		var keys = Object.keys(tag), l = keys.length;
		if (l > 8) return 8;
		for (var i = 0; i < l; i++) {
			var v = tag[keys[i]], t = typeof v;
			if (typeof v == 'string') {
				tag[keys[i]] = v.substring(0, 300);
			} else if (t == 'number' || t == 'boolean') {
				//nothing
			} else {
				return 110;
			}
		}
		return 1;
	},

	encode: function (str) {
		return encodeURIComponent(str);
	},

	store: function (name, value, fn) {
		if (typeof value == 'object') {
			value = JSON.stringify(value);
		}

		try {
			wx.setStorageSync(name, value)
		} catch (e) { }

		fn(1);
	},

	getStore: function (name, fn) {

		var value = wx.getStorageSync(name)
		if (value) {
			return fn(JSON.parse(value));
		} else {
			return fn('');
		}
	}
}


/**
 * 获取信息
 */
var agentInfo = (function () {
	var data = {};
	//= 通过wx接口获取的设备数据
	function initDevice() {
		if (typeof wx == 'object') {
			wx.getNetworkType({
				success: function (res) {
					data['networkType'] = res.networkType
				}
			});

			wx.getSystemInfo({
				success: function (res) {
					if (res.errMsg == 'getSystemInfo:ok') {
						data['language'] = res.language;
						data['version'] = res.version;
						data['model'] = res.model;			//'iPhone 6'
						data['pixelRatio'] = res.pixelRatio;
						data['windowWidth'] = res.windowWidth;
						data['windowHeight'] = res.windowHeight;

						data['system'] = res.system;
						data['platform'] = res.platform;
						data['ver'] = res.SDKVersion;
					}
				}
			});

		}
	}


	function setGeoCity(resp) {
		if (resp && resp.data) {
			try {
				data['ctripcity'] = resp.data.CityEntities[0].CityName;
			} catch (e) { }
		}
	}
	//= 
	function initCWXData() {
		if (typeof cwx == 'object') {
			data['clientID'] = cwx.clientID || '';
			data['user'] = cwx.user;

			if (cwx.mkt) {
				cwx.mkt.getUnion(function (unionData) {
					unionData = unionData || {};
					//{"allianceid": "262684", "sid": "711465", "ouid": "', "sourceid": "55552689", "exmktid":"{\"ReferralCode\":\"A5D6\"}"}
					data['allianceid'] = unionData['allianceid'];
					data['alliancesid'] = unionData['sid'];
					data['allianceouid'] = unionData['ouid'];
					data['sourceid'] = unionData['sourceid'];
					data['exmktid'] = unionData['exmktid'];
				});
			}

			if (cwx.locate) {
				let c_point = cwx.locate.getCachedGeoPoint();
				let c_city = cwx.locate.getCachedCtripCity();

				if (c_city) {
					setGeoCity(c_city)
				}


				if (c_point) {
					data['geo'] = {
						"latitude": c_point.latitude || 0,
						"longitude ": c_point.longitude || 0
					}
				}

			}
		}
	}

	if (typeof cwx == 'object') {
		data['clientID'] = cwx.clientID || '';

		/**
		 *  1、cwx.user.auth：当前登录态
		 *	2、cwx.user.duid： UBT 使用duid 加密串
		 *	3、cwx.user.checkLoginStatusFromServer(callback); //立即网络请求检测，异步
		 *	4、cwx.user.isLogin(); //内存判断，同步
		 */
		data['user'] = cwx.user;
	}

	return {

		get: function (name, defaultValue) {
			return data[name] || defaultValue;
		},

		init: function () {
			initDevice();
			initCWXData();
		}
	}
})();

/**
*  只能占用一个request请求，所有数据走通过Q发送
*/
var Q = (function () {
	var queue = [], leisure = true;

	function send() {
		leisure = false;
		var data = queue.shift();
		//var _request = (useSocket == 1 && cwxscoket.isEnable() ? cwxscoket.request : wx.request);
		var _request = (cwx.useSocket == '1' && cwxscoket.isEnable() ? cwxscoket.request : wx.request);

		var prefix;
		if (useSocket) {
			prefix = 'https://m.ctrip.com/framework/ubt/bf.gif?';
		} else {
			prefix = 'https://s.c-ctrip.com/bf.gif?';
		}

		_request({
			url: prefix + data,
			// url: 'http://s.uat.qa.nt.ctripcorp.com/framework/ubt/bf.gif?' + data,

			header: {
				//'Content-Type': 'application/json'
				'Content-Type': 'image/gif' //image/gif | application/x-tgif
			},
			method: 'GET',
			dataType: 'image',
			complete: function (res) {
				if (queue.length < 1) {
					leisure = true;
				} else {
					setTimeout(function () {
						send();
					}, 50)
				}
			}
		})

	}

	return {
		add: function (data, priority) {
			if (typeof data == 'string') {

				priority ? queue.unshift(data) : queue.push(data);
				if (leisure) send();
				return queue.length;
			} else {
				return false;
			}
		},

		length: function () {
			return queue.length;
		}
	}
})();

class Pageview {

	constructor(options, fn, first) {
		this.queue = [];
		this.ts = Y.now();
		this.isfirst = first;

		this.status = {
			newsid: 0,
			newvid: 0,
			ready: 0
		}

		this.data = {
			url: "",
			orderid: "",
			abtest: "",
			pid: 0,
			vid: "",
			sid: 0,
			pvid: 0,
			tid: "",		//=Correction ID
			ppv: 0,
			ppi: 0
		}

		this.callback = typeof fn == "function" ? fn : noop;
		this.init(options);
	}

	setOptions(options) {
		if (typeof options == "object") {
			if (typeof options["pageId"] != "undefined") {
				this.data.pid = options.pageId;
				this.status.ready += 1;
			}

			if (typeof options["url"] == "string") {
				this.data.url = options["url"];
			}

			if (typeof options["orderid"] == "string" || typeof options["orderid"] == "number") {
				this.data.orderid = options["orderid"];
			}

			if (options["tid"]) {
				this.data.tid = options["tid"]
			}


			this.data.isBack = options['isBack'] ? 1 : 0;

		}

		this.checkSend();
	}

	init(options) {

		var that = this;

		this.user = agentInfo.get('user', {});
		this.setOptions(options);

		var fn = function () {
			that.status.ready += 1;
			that.checkSend();
		}

		Y.getStore(STORAGE_KEY, function (data) {
			var ts = Y.now();

			if (data && typeof data == 'object') {
				if (ts - data.ts * 1 > SESSION_MAX_LIEFTIME) {
					that.status.newsid = 1;
					data.sid = data.sid * 1 + 1;
					that.data.ppi = 0;
					that.data.ppv = 0;
				} else {
					that.data.ppi = data.pid;
					that.data.ppv = data.pvid;
				}
				data.pvid = data.pvid * 1 + 1;
				data.ts = ts;
			} else {
				data = {
					vid: ts + '.' + Y.uniqueID().toString(36),
					sid: 1,
					pvid: 1,
					ts: ts,
					create: ts
				}

				that.status.newvid = 1;
				that.status.newsid = 1;
			}

			that.update(data, fn);
		});
	}

	update(data, fn) {
		data.pid = this.data.pid;
		this.data.vid = data.vid;
		this.data.sid = data.sid;
		this.data.pvid = data.pvid;
		//
		// __global.vid = this.data.vid;
		// __global.pid = this.data.pid;
		// __global.sid = this.data.sid;
		// __global.pvid = this.data.pvid;
		//
		Y.store(STORAGE_KEY, data, fn);
	}

	isLogin() {
		return this.user.duid && this.user.isLogin && this.user.isLogin();
	}

	isReady() {
		return this.status.ready == 10;
	}

	getCommon() {
		__global.vid = this.data.vid;
		__global.pid = this.data.pid;
		__global.sid = this.data.sid;
		__global.pvid = this.data.pvid;
		//
		return [
			this.data.pid,
			this.data.vid,
			this.data.sid,
			this.data.pvid,
			this.data.tid,
			this.getABtest(),
			"",		//offline module
			VERSION,     //version
			"",      //fp
			"",		 //TCP Agent
			cwx.appId || "",
			'',
			'',
			'',
			SDK_AGENT_ENV       //= ENV
		];
	}

	getABtest() {
		return Y._data_['abtest'] || this.data.abtest;
	}

	isSampled(sample) {
		if (sample >= 100) return true;
		var h = Y.hash(this.data.vid);
		return h && (h % 100) > (100 - sample * 1);
	}

	makeData() {
		var info = Y.makeSlice(36, '');
		info[0] = 13;		//11
		info[1] = this.data.ppi;
		info[2] = this.data.ppv;
		info[3] = this.data.url;
		info[4] = agentInfo.get('windowWidth', 0)
		info[5] = agentInfo.get('windowHeight', 0);
		info[7] = agentInfo.get('language', "zh_CN");

		info[11] = this.getABtest();
		info[12] = this.status.newvid;
		info[13] = this.isLogin();
		info[14] = agentInfo.get('nickName', "");

		// alliance
		info[18] = agentInfo.get('allianceid', "");								// 18	alliance_id	 
		info[19] = agentInfo.get('alliancesid', "");								// 19	alliance_sid	
		info[20] = agentInfo.get('allianceouid', "");									// 20	alliance_ouid	 	 	

		info[21] = Y._data_['orderid'] || this.data.orderid;
		info[22] = this.user.duid; //duid;
		info[26] = agentInfo.get('clientID', "");
		info[28] = JSON.stringify({
			version: agentInfo.get('version', ""),
			ver: agentInfo.get('ver', ''),
			net: agentInfo.get('networkType', "None"),		//5.9加入，返回当前网络状态 2G/3G/4G/WIFI/None
			platform: agentInfo.get('platform', ''),
			wxver: __global.version || ''
		})
		info[29] = SDK_AGENT_ENV;
		info[30] = agentInfo.get('pixelRatio', 1);;
		info[31] = this.status.newsid;										//session标识
		info[32] = JSON.stringify({
			isBack: this.data.isBack,
			// platform: agentInfo.get('platform', ''),
			system: agentInfo.get('system', ''),
			model: agentInfo.get('model', ""),			//device version
			// version: agentInfo.get('version', ""),		//weixin version
			// ver: agentInfo.get('ver', ''),
			// networkType: agentInfo.get('networkType', ""),	// networkType
			city: agentInfo.get('ctripcity', ""),
			geo: agentInfo.get('geo', {}),
			openid: cwx.cwx_mkt && cwx.cwx_mkt.openid || "",
			sourceid: agentInfo.get("sourceid", ''),
			launch: this.isfirst
		});
		info[34] = cwx.scene || "";

		return info;
	}

	checkSend() {
		if (this.status.ready > 1) {
			this.status.ready = 10;

			agentInfo.init();
			this.sendData("uinfo", this.makeData(), 99);

			for (var i = 0; i < this.queue.length; i++) {
				this._send_by_http(this.queue[i]);
			}
			if (typeof this.callback == "function") this.callback(1);
		};
	}

	/**
	 *  更新为http数据发送格式
	 */
	sendData(type, data, priority) {

		var obj = {
			"dataType": type,
			"priority": priority || 0,
			"d": data
		}

		if (this.isReady()) {
			this._send_by_http(obj);
		} else if (this.queue.length < 50) {
			this.queue.push(obj);
		}
	}

	_send_by_http(o) {
		var obj;
		var params = '';
		switch (o.dataType) {
			case 'matrix':
			case 'useraction':
				obj = [
					[1, o.dataType],
					this.getCommon(),
					[o.d]
				];
				params = 'ac=a&d=';		//ctype 指定压缩方式: 
				// params += cwx.util.lz77.encodeURIComponent(JSON.stringify(obj))+'&v=' + VERSION;
				break;
			default:
				obj = {
					c: this.getCommon(),
					d: {}
				}
				obj.d[o.dataType] = o.d;
				params = 'ac=g&d=';
				// params += Y.encode(JSON.stringify(obj))+'&v=' + VERSION;
				break;
		}

		params += UZip.compress(JSON.stringify(obj)) + '&c=1&v=' + VERSION;


		Q.add(params, o.priority);
	}

	tracklog(name, value, fn) {
		var ret = 0;
		if (typeof name == "object") {
			value = name.value || "";
			fn = name.callback || noop;
			name = name.name || "";
		}

		if (Y.isNStr(name) && Y.isNStr(value)) {

			this.sendData("t", [
				7,
				name,
				value,
				this.user.duid,			// duid
				agentInfo.get('clientID', ""),			// clientID
				SDK_AGENT_ENV 	//
			])

			ret = 1;
		}

		if (typeof fn === "function") fn(ret);
	}

	trackMetric(options) {
		var result = 0;

		if (typeof options == "object") {
			var param = Object.assign({
				name: "",
				tag: {},
				value: 0,
				ts: Y.now(),
				callback: noop,
				sample: 100
			}, options);

			if (this.isSampled(param.sample)) {
				if (Y.isNStr(param.name) && Y.isNumeric(param.value)) {
					if ((result = Y.check_tags(param.tag)) == 1) {
						this.sendData("matrix", {
							name: param.name,
							tags: param.tag,
							value: param.value,
							ts: param.ts
						})
					}
				}
			}

			if (typeof param.callback == "function") {
				param.callback(result);
			}
		}

		return result;
	}

	trackError(options, fn) {
		var keys = ["version", "message", "line", "file", "category", "framework", "time", "repeat", "islogin", "name", "column"];
		var data = [7, "", 0, "", "", "", Y.now() - this.ts, 1, this.isLogin(), "", 0];
		for (var i = 0, l = keys.length; i < l; i++) {
			var key = keys[i];
			if (options[key]) {
				var _v = options[key] + "";

				switch (key) {
					case "message":
					case "file":
						_v = _v.substring(0, 500);
						break;
					case "category":
					case "framework":
					case "name":
						_v = _v.substring(0, 100);
						break;
					case "time":
						_v = parseInt(_v, 10);
						break;
					case "column":
						_v = parseInt(_v, 10);
						break;
					default:
						_v = parseInt(_v, 10) || 0;
				}

				data[i] = _v;
			}
		}

		var stack = '';
		if (options.stack && Array.isArray(options.stack)) {
			stack = options.stack.join('');
		}
		stack = stack.slice(data.join('').length - 2000);
		data.push(stack);

		this.sendData("error", data);
	}

	/**
	* 用于发送UBT的数据接口，需要和PV强关联的数据请使用此接口发送统计数据。
	*
	* @method send 
	* @param {type}  	(pv|tracelog|metric|error)  
	* @param {mixin}	传对应的type接口数据
	* @example
	* ```
	* 
	* // 发送PV数据
	* Log.send('pv', {
	* 	page_id: "",		//页面pageid，通过CMS系统上申请维护的pageID值，通过pageid可以直接查询UBT数据报表
	* 	url: "",			
	* 	orderid: "",		//订单信息
	* 	refer: ""			//上一个页面的URL
	* })
	* 
	* // 发送tracelog数据
	* Log.send('tracelog', {
	* 	name: "",
	* 	value: ""
	* })

	* // 发送metric数据
	* Log.send('metric', {
	* 	name: 'metric.name',	//Metric name
	* 	tag: {		//自定义Tag项
	* 		tag1: 'tag value'
	* 	},
	* 	value: 0	//number 
	* })
    *
	* // 发送Error统计
	* Log.send('error', {
	* 	message: "",
	* 	file: "",
	* 	category: "",
	* 	framework: "",
	* 	name: "",
	* 	time: 0,
	* 	column: 0
	* });
	*
	* 
	* ```
	*/
	send(atype, options) {
		if (!atype) return this;

		switch (atype) {
			case 'pv':
				if (this.isReady()) {
					return new Pageview(options);
				} else {
					this.setOptions(options);
				}
				break;
			case 'tracelog':
				this.tracklog(options)
				break;
			case 'metric':
				this.trackMetric(options);
				break;
			case 'error':
				this.trackError(options);
				break;
			case 'useraction':
				this.sendData(atype, options);
		}

		return this;
	}
}

Pageview.__data__ = [];
Pageview.first_pv = true;
Pageview.instance = new Pageview({}, noop, Pageview.first_pv);

module.exports = {
	createPV: function (option, fn) {
		option = option || {};
		fn = fn || noop;

		if (Pageview.first_pv) {
			Pageview.first_pv = false;
			/**
			 * 第一个PV，需要在初始化之前同步下Agent信息，避免出现空值 如：cwx.user等
			 */
			agentInfo.init();
			Pageview.instance.init(option);

			for (var i = 0; i < Pageview.__data__.length; i++) {
				let item = Pageview.__data__[i];
				if (item.type) {
					Pageview.instance.send(item.type, item.data);
				}
				// Pageview.instance.trackMetric(Pageview.__data__[i]);
			}
			Pageview.__data__ = [];

			setTimeout(function () {
				let tag = {};
				let exmktid = agentInfo.get('exmktid', '');
				if (exmktid) {
					try {
						exmktid = typeof exmktid === 'string' ? JSON.parse(exmktid) : exmktid;
						tag.openid = exmktid.openid || "";
						tag.unionid = exmktid.unionid || "";
					} catch (e) { }
				}

				tag['allianceid'] = agentInfo.get('allianceid', "");								// 18	alliance_id	 
				tag['alliancesid'] = agentInfo.get('alliancesid', "");								// 19	alliance_sid	
				tag['allianceouid'] = agentInfo.get('allianceouid', "");
				tag['sdkver'] = agentInfo.get('ver', "");
				Pageview.instance.send("metric", {
					name: "wxxcx_launch",
					tag: tag,
					value: 1
				})

			}, 300)
		}else{
			Pageview.instance = new Pageview(option, fn, Pageview.first_pv);
		}
		return Pageview.instance;
	},

	ubtMetric: function (option) {
		if (Pageview.instance) {
			Pageview.instance.send('metric', option);
		} else {
			Pageview.__data__.push({ type: 'metric', data: option });
		}
	},

	ubtTrace: function (name, value) {
		let valueStr = '';
		if(typeof value == 'string'){
			valueStr = value;
		}else{
			valueStr = JSON.stringify(value);
		}
		
		let option = {
			name: name,
			value: valueStr
		}
		if (Pageview.instance) {
			Pageview.instance.send('tracelog', option);
		} else {
			Pageview.__data__.push({ type: 'tracelog', data: option });
		}
	},

	set: function (name, value) {
		Y._data_[name] = value;
	},
	getState: function () {
		var data = Pageview.instance.getCommon();
		return {
			vid: data[1],
			pid: data[0],
			sid: data[2],
			pvid: data[3],
			cid: cwx.clientID
		}
	}
}
