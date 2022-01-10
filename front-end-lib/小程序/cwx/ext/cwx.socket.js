/**
、 * 需要重构的点 1. follow数组超时需要删除 2. 42* 已处理 3.
 *
 * 4215[] 4000 42[] 100/min
 *
 * 参考github的微信小程序socket.io
 *
 * 2017/9/21继续对于wx.request对象做了copy，对于低版本的wx.networkchange做了容错，目前对于request返回的那个自定义对象还没做处理，参考cwx.request也没有处理，列入计划
 *
 * @module cwx/socket
 */

var __global = require('./global.js');
var cwx = __global.cwx;

var requestd = {};
var useBinary = true;
var firstConnectIsBroken = 0;
var UZip = require('uzip')
//require('./Uzip.min');

function _log() {
	//return;
	console.warn.apply(console, arguments);
}

function _generateRequestID() {
	return (+new Date());
}

function _formatRequestURL(url) {
	if (url.indexOf("/") != 0 || url.indexOf("http") == 0) { // 联调完去掉这个判断
		// _log("警告：请使用相对路径 ", url);
		return url;
	}
	var host = __global.host
	if (__global.env.toLowerCase() === 'uat') {
		host = __global.uat;
	} else if (__global.env.toLowerCase() === 'fat') {
		host = __global.fat
	}
	return "https://" + host + url;
}

function __createHeader(header) {
	var _header = header || {};
	try {
		_header["x-ctx-locale"] = "zh-CN";
		_header["x-ctx-group"] = "ctrip";
		_header["x-ctx-region"] = "CN";
		_header["x-ctx-currency"] = "CNY";
		var _mktCookie = cwx.mkt.getUnionForCookie();
		if (_mktCookie) {
			_header.Cookie = _mktCookie + ";" + (_header.Cookie || "");
		}
		if(cwx.cwx_mkt && cwx.cwx_mkt.openid){
			//console.error('recoard opejndasd')
			_header['x-wx-openid'] = cwx.cwx_mkt.openid;
			/**
			 * 设置x-wx-env:dev避免socket被gateway拦截
			 */
			if(__global.env != 'prd'){
				_header['x-wx-env'] = 'dev';
			}
			//_header['x-wx-env'] = 'dev';
		}
	} catch (e) {
		// _log("__createHeader error = ", e);
	}
	return _header;

}

var count = 0;

function WS() {
	var self = this;
	self.ready = false;
	self.enable = true;
	self.heartbeat = false;
	self.queue = [];
	self.follow = {};
	self.errorCount = 0;
	self.sendErrorCount = 0;
	self.encodeErrorCount = 0;
	self.timeoutCount = 0;


	self.isEnable = function(){
		return self.enable;
	}
	//
	var connectUrl = "wss://socketio.ctrip.com/api/?EIO=3&transport=websocket&path=api&retryTimes=3&retryInterval=1000";
	if (__global.env.toLowerCase() === 'uat') {
		connectUrl = "wss://socketio.ctrip.uat.qa.nt.ctripcorp.com/api/?EIO=3&transport=websocket&path=api&retryTimes=3&retryInterval=1000";
	} else if (__global.env.toLowerCase() === 'fat') {
		connectUrl = "wss://socketio.fws.qa.nt.ctripcorp.com/api/?EIO=3&transport=websocket&path=api&retryTimes=3&retryInterval=1000";
	}
	//connectUrl = "wss://socketio.fws.qa.nt.ctripcorp.com/api/?EIO=3&transport=websocket&path=api&retryTimes=3&retryInterval=1000";

	//add socket request query param
	connectUrl += "&subProtocol=ctrip.lz77bin";

	_log('socket connectUrl', connectUrl);

	self.init = function() {

	    connectUrl = "wss://socketio.ctrip.com/api/?EIO=3&transport=websocket&path=api&retryTimes=3&retryInterval=1000";
	    if (__global.env.toLowerCase() === 'uat') {
	        connectUrl = "wss://socketio.ctrip.uat.qa.nt.ctripcorp.com/api/?EIO=3&transport=websocket&path=api&retryTimes=3&retryInterval=1000";
	    } else if (__global.env.toLowerCase() === 'fat') {
	        connectUrl = "wss://socketio.fws.qa.nt.ctripcorp.com/api/?EIO=3&transport=websocket&path=api&retryTimes=3&retryInterval=1000";
	    }
	    //connectUrl = "wss://socketio.fws.qa.nt.ctripcorp.com/api/?EIO=3&transport=websocket&path=api&retryTimes=3&retryInterval=1000";

	    //add socket request query param
	    connectUrl += "&subProtocol=ctrip.lz77bin";

	    _log('socket connectUrl', connectUrl);

		self.enable = true;
		_log('connection init now');
		// self.ws = new WebSocket(url);

		self.heartbeat = true;
		self.socketTask = wx.connectSocket({
			//protocols: ['ctrip.wsbin'],
//			header: {
//				'Sec-WebSocket-Protocol' : 'ctrip.lz77bin'
//			},
			//protocols: ['ctrip.lz77bin'],
			url : connectUrl,
			fail: function(){
				self.enable = false;
				firstConnectIsBroken = 1;

			}

		});
		self.socketTask.onOpen(function() {
			_log('connection is opening!');
			self.heartbeat = false;
			self.ready = true;
			//self.enable = true;
			firstConnectIsBroken = -1;
		});
		self.socketTask.onMessage(function(e) {
			try{
				if(e == undefined || e.data == undefined || e.data == ''){
					return;
				}

				//_log(e);
				//e.data = ab2str(e.data);
				if(typeof(e.data) != 'string' && useBinary){
					e.data = UZip.decompress(e.data, {
						mode: 'binary'
					});
				}
				if(!/"payload":"GIF89a/.test(e.data)){
					_log('socket receive message is', e);
				}

				//_log(e);

//			e.data = cwx.util.lz77.decodeURIComponent(e.data);
//			_log(e);
//			try{
//				e.data = cwx.util.lz77.decodeURIComponent(e.data);
//			}catch(e){
//				_log(e);
//			}
//			_log(e);
			//if (/^42\d*\[\"httpEvent\"/.test(e.data)) {
				var res = e.data.match(/\{[\s\S]+\}/);
				if (res && res.length) {
					try {
						res = JSON.parse(res[0]);
						var seqNo = res.seqNo;
						if(seqNo in self.follow){
							var cmd = self.follow[seqNo].callback;
							if(self.follow[res.seqNo].timeout){
								clearTimeout(self.follow[res.seqNo].timeout);
							}
							// _log('cmd is', cmd);
							try{
								res.data = res.payload;
								try {
									res.data = JSON.parse(res.payload);
								} catch (e) {
									try{
										res.data = JSON.parse(res.payload.trim());
									}catch(e1){

									}
								}
								res.header = res.headers || {};
								res.errMsg = "request:ok";
								if (res.statusCode == 200) {
									// _log('receiveMsg',JSON.parse(res.payload));

									// if(cmd.dataType == 'json'){

									// }
									if (res.payload && res.payload.indexOf('GIF') == 0) {

									} else {
										//_log('cmd is', cmd);
										//_log(e.data);
										//_log(res);
										//_log('socket receiveMsg', res.data);
									}
									cmd && cmd.success && cmd.success(res);
								} else {
									cmd && cmd.fail && cmd.fail(res);
								}
							}catch(e){
								throw e;
							}finally{
								try{
									cmd && cmd.complete && cmd.complete(res);
								}catch(e1){
									throw e1;
								}finally{
									delete self.follow[res.seqNo];
								}
							}
						}
					} catch (e) {
						_log('socket receive error message');
						_log(e);
					}
				}
			//}
			}catch(e){
				logSocketError('socketdealerror', stringify(e));
//				wx.request({
//					url: 'https://mm.ctrip.com/framework/ubt/t/wx0e6ed4f51db9d078/101372.gif'
//				});
				throw e;
			}
		});
		self.socketTask.onClose(function(e) {
			if(firstConnectIsBroken == 0){
				firstConnectIsBroken = 2
			}
			self.heartbeat = false;
			self.networkIsWrong();
			if(firstConnectIsBroken > 0){

				_log('socket init connect fail!');

				logSocketError('socketconnectfail', 'not support socket');
				self.enable = false;
			}
			_log('connection closed!');

		});
		self.socketTask.onError(function(e) {
			_log('socket error is', e);
			logSocketError('socketerror', stringify(e));

			self.errorCount++;
			if(self.errorCount >= 3){
				self.enable = false;
				self.networkIsWrong();
				logSocketError('socketerrorabove3', 'socket error count > 3');
			}
//			wx.request({
//				url: 'https://mm.ctrip.com/framework/ubt/t/wx0e6ed4f51db9d078/101371.gif'
//			});
		})
	}
	self.networkIsWrong = function(type){
		self.ready = false;
		if(self.follow){
			for(var seqNo in self.follow){
				if(self.follow[seqNo]){
					if(self.follow[seqNo].timeout){
						clearTimeout(self.follow[seqNo].timeout);
					}
					var cmd =  self.follow[seqNo].callback;
					try{
						cmd && cmd.fail && cmd.fail({
							errMsg: "request:fail",
							data: null
						});
					}catch(e){
					}
					try{
						cmd && cmd.complete && cmd.complete({
							errMsg: "request:fail",
							data: null
						});
					}catch(e1){
					}
				}
				delete self.follow[seqNo];
			}
			var object;
			while(object = self.queue.pop()){
				cwx._request(object);
			}
		}
	}
	self.addNetRetry = function() {
		//_log('add network watch!');
		if (wx.onNetworkStatusChange) {
			wx.onNetworkStatusChange(function(res) {
				_log('reconnection by networkchange!');
				if (res.isConnected) {
					//self.heartbeat = true;
					_log('try to reconnect!');
					self.init();
				} else {
					_log('no network!');
					self.networkIsWrong();
					//wx.closeSocket();
					self.socketTask.close();
				}
			})
			//self.heartbeat = true;
		}
	}
	self.queue.push = function(item) {
		Array.prototype.push.call(self.queue, item);
		// _log(item);
		if (/ubt\/bf.gif/.test(item.url)) {
			// ubt走定时发送
		} else {
			// 服务类请求走立即发送
			if (self.enable && self.ready && self.queue.length) {
				//_log('socket push cmd into queue', item);
				self._send();
			}else{
				var cmd = self.queue.shift();
				cmd && cwx._request(cmd);
			}
		}
	}
	self.send = function(m) {
		self.queue.push(m);
		// self.follow[m.seqNo] = m;
		/**
		 * 按照CCD要求,改成异步定时队列发送，这里只插入消息
		 */
		// if(self.ready)self._send();
	}
	self._send = function() {
		try{
			var cmd = self.queue.shift();
			if (cmd == null) {
				return;
			}
			var cmdMsg = formatWXRequest(cmd);
			//
			if(cmdMsg && cmdMsg.uri && !/bf.gif/.test(cmdMsg.uri)){
				_log('cmd is', cmdMsg);
			}
			//
			var seqNo = cmd.seqNo;
			self.follow[seqNo] = {
				callback : cmd
			};
			self.follow[seqNo].timeout = setTimeout(function() {
				if (cmd && self.follow[seqNo]) {
					try{
						cmd && cmd.fail && cmd.fail({
							errMsg: "request:fail",
							data: null
						});
					}catch(e){
						//
					}
					try{
						cmd && cmd.complete && cmd.complete({
							errMsg: "request:fail",
							data: null
						});
					}catch(e1){
					}
					delete self.follow[cmd.seqNo];
					self.timeoutCount++;
					if(self.timeoutCount >= 3){
						self.enable = false;
						self.networkIsWrong();
						logSocketError('sockettimeoutabove3', 'socket error count > 3');
					}
				}
			}, cmd.timeoutSecond || 30000);
			var data;
			//_log('cmd is', cmd);
			if(useBinary){
				data = JSON.stringify(cmdMsg);
				//_log('data is', data);
				data = UZip.compress(data, {
					mode: 'binary'
				});
				if(cmdMsg && cmdMsg.uri && !/bf.gif/.test(cmdMsg.uri)){
					_log('binary data length', data.byteLength);
				}
			}else{
				data = [ 4, 2, JSON.stringify([ 'httpEvent', cmdMsg ]) ].join('');
			}
			//data = cwx.util.lz77.encodeURIComponent(data);
			//_log(data);
			//data = wx.base64ToArrayBuffer(data);
			//data = str2ab(data);

			//_log(data);
			//_log('['+data.join(',')+']');
			var msg = {
				data : data,
				fail : function(e) {
					//
					_log('socket send fail');
					try{
						cmd && cmd.fail && cmd.fail({
							errMsg: "request:fail",
							data: null
						});

						//self.queue.unshift(cmd);
						// cmd.fail && cmd.fail();
					}catch(e){
					}
					try{
						cmd && cmd.complete && cmd.complete({
							errMsg: "request:fail",
							data: null
						});
					}catch(e1){
					}
					if(self.follow && self.follow[seqNo] && self.follow[seqNo].timeout){
						clearTimeout(self.follow[seqNo].timeout);
					}
					delete self.follow[cmd.seqNo];
					logSocketError('socketsenderror', stringify(e));
					//
					self.sendErrorCount++;
					if(self.sendErrorCount >= 3){
						self.sendErrorCount = 0;
						self.ready = false;
					}
				}
			};
			/*
			if(cmdMsg && cmdMsg.uri && !/bf.gif/.test(cmdMsg.uri)){
				_log('socket sendMsg', msg);
			}
			*/
			//wx.sendSocketMessage(msg);
			self.socketTask.send(msg);
		}catch(e){
			logSocketError('socketsenderror', stringify(e));
			_log('socketsenderror', e);
//			wx.request({
//				url: 'https://mm.ctrip.com/framework/ubt/t/wx0e6ed4f51db9d078/101373.gif'
//			});
			self.encodeErrorCount++;
			if(self.encodeErrorCount >= 3){
				self.enable = false;
				self.networkIsWrong();
			}

			throw e;
		}
	}
	self.cancel = function(requestID) {
		if (self.follow[requestID]) {
			if(self.follow[requestID].timeout){
				clearTimeout(self.follow[requestID].timeout);
			}
			delete self.follow[requestID];
			return 1;
		}
		return 0;
	}
	self.watcher = setInterval(function() {
		if (self.ready == false && self.heartbeat == false && self.queue.length) {
			wx.getNetworkType({
				success : function(res) {
					var networkType = res.networkType;
					if (networkType != 'none' && self.ready == false) {
						_log('reconnection by watcher!');
						self.init();
					}
					if (networkType == 'none'){
						//wx.closeSocket();
					    self.socketTask.close();
					}
				}
			})
		}
		if (self.ready && self.queue.length) {
			self._send();
		}
	}, 300);

	self.reset = function(){
	    //wx.closeSocket()
	    self.socketTask.close();
	    self.init();
	}

	self.init();
	self.addNetRetry();
}
var ws = new WS();

function stringify(e){
	try{
		return JSON.stringify(e);
	}catch(e){
		try{
			var re = {};
			for(var p in e){
				re[p] = JSON.stringify(e[p]);
			}
			return JSON.stringify(re);
		}catch(e1){
			try{
				return e.toString();
			}catch(e2){
				return e;
			}
		}

	}
}


// 发送网络请求, 异步返回结果，函数返回值为本次请求生成的requestID， 该requestID在cancel时候可以使用
function request(object) {
	var header = __createHeader(object.header);
	object.header = header;
	// _log("request header = ", object.header);
	if (!object.data) {
		object.data = {};
	}
	var data = object.data;

	var auth = ""
	if (cwx.user && cwx.user.auth) {
		auth = cwx.user.auth
	}

	object.url = _formatRequestURL(object.url);
	// _log("cwx.request.url==" + object.url);
	object.method = object.method || 'POST';
	object.requestID = _generateRequestID();

	var oComplete = object.complete || function() {
	};
	var nComplete = function(res) {
		if (oComplete) {
			oComplete(res);
		}
	}

	nComplete.startTime = +new Date();
	nComplete.requestID = object.requestID;
	object.complete = nComplete;
	// 默认的head
	var _head = {
		cid  : cwx.clientID,
		ctok : '',
    cver : __global.version,
		lang : '01',
		sid  : '',
		syscode : (cwx.systemCode || "").toString(),
		auth : auth,
		sauth : '',
	};
	if (data && data.head) {
		Object.keys(data.head).forEach(function(pro) {
			_head[pro] = data.head[pro];
		})
	}

  if (typeof _head.extension == "undefined") {
    _head.extension = []
  }

  var scene = (cwx.scene || "") + ""
  _head.extension.push({ "name": "appId", "value": cwx.appId || "" });
  _head.extension.push({ "name": "scene", "value": scene});

	data.head = _head;

	ws.send(object);
	return object.requestID;
}
function formatReqURL(url) {
	// return url.replace(/https:\/\/\w+.ctrip.com\/restapi/,
	// '').replace(/https:\/\/\w+.ctrip.com\/framework/, '').replace(/\?[^\?]+/,
	// '');
	return url.replace(/\?[^\?]+/, '');
}
function formatWXRequest(object) {
	object.header = object.header || {};
	object.header['content-type'] = object.header['content-type'] || 'application/json';
	object.seqNo = object.requestID;
	var re;
	if (/^get$/ig.test(object.method)) {
		var params = getSearchFromURL(object.url);
		for ( var k in object.data) {
			var y = object.data;
			var put = encodeURIComponent(y[k]);
			if (k in params) {
				params[k].push(put);
			} else {
				params[k] = [ encodeURIComponent(put) ];
			}
		}
		re = {
			"seqNo" : object.seqNo,
			"uri" : formatReqURL(object.url),
			"payload" : "",
			"method" : object.method.toUpperCase(),
			"headers" : object.header,
			"params" : params
		}
	} else {
		re = {
			"seqNo" : object.seqNo,
			"uri" : formatReqURL(object.url),
			//"payload" : JSON.stringify(object.data),
			"method" : object.method.toUpperCase(),
			"headers" : object.header,
			"params" : getSearchFromURL(object.url)
		}
		if(/^application\/x-www-form-urlencoded$/ig.test(object.header['content-type'])){
			if(typeof(object.data) != 'string'){
				var y = object.data;
				var z = [];
				for(var k in object.data){
					var put = encodeURIComponent(y[k]);
					z.push(k + '=' + put);
				}
				re.payload = z.join('&');
			}
		}else{
			re.payload = JSON.stringify(object.data);
		}
	}
	if (!/ubt\/bf.gif/.test(object.url)) {
		//_log(object.url)
		//_log(re);
	}
	return re;
}
function getSearchFromURL(url) {
	var r = {};
	if (url.indexOf('?') > -1) {
		var a = url.match(/\?([^\?]+)/)[1].split('&');
		for (var i = 0; i < a.length; i++) {
			var a1 = a[i].split('=');
			r[a1[0]] = r[a1[0]] = [];
			r[a1[0]].push(a1.length > 1 ? a1[1] : '');
		}
	}
	return r;
}

function logSocketError(type, msg){
	var params = {
			ac: 'tl',
			pi: '212044',
			key: type,
			val: msg,
			pv: '1497592824873.1w6agx.280.32764',
			v: '6',
			env: 'weixin',
			_mt: 'jakomjwclpoq9',
			t: +new Date()
	}
	var add = [];
	for(var p in params){
		 add.push(p + '=' + encodeURIComponent(params[p]))
	}
	wx.request({
		url: 'https://s.c-ctrip.com/bf.gif?' + add.join('&')
	});
}



requestd.request = request;
requestd.cancel = ws.cancel;
requestd.isEnable = ws.isEnable;
requestd.reset = ws.reset;

module.exports = requestd;

//function ab2str(buf) {
//	var bufView = new Uint8Array(buf);
//	var unis = [];
//    for (var i = 0; i < bufView.length; i++) {
//    	unis.push(bufView[i]);
//    }
//
//    return utf8ByteToUnicodeStr(unis);
//}
//function utf8ByteToUnicodeStr(utf8Bytes){
//    var unicodeStr ="";
//    for (var pos = 0; pos < utf8Bytes.length;){
//        var flag= utf8Bytes[pos];
//        var unicode = 0 ;
//        if ((flag >>>7) === 0 ) {
//            unicodeStr+= String.fromCharCode(utf8Bytes[pos]);
//            pos += 1;
//
//        } else if ((flag &0xFC) === 0xFC ){
//            unicode = (utf8Bytes[pos] & 0x3) << 30;
//            unicode |= (utf8Bytes[pos+1] & 0x3F) << 24;
//            unicode |= (utf8Bytes[pos+2] & 0x3F) << 18;
//            unicode |= (utf8Bytes[pos+3] & 0x3F) << 12;
//            unicode |= (utf8Bytes[pos+4] & 0x3F) << 6;
//            unicode |= (utf8Bytes[pos+5] & 0x3F);
//            unicodeStr+= String.fromCharCode(unicode) ;
//            pos += 6;
//
//        }else if ((flag &0xF8) === 0xF8 ){
//            unicode = (utf8Bytes[pos] & 0x7) << 24;
//            unicode |= (utf8Bytes[pos+1] & 0x3F) << 18;
//            unicode |= (utf8Bytes[pos+2] & 0x3F) << 12;
//            unicode |= (utf8Bytes[pos+3] & 0x3F) << 6;
//            unicode |= (utf8Bytes[pos+4] & 0x3F);
//            unicodeStr+= String.fromCharCode(unicode) ;
//            pos += 5;
//
//        } else if ((flag &0xF0) === 0xF0 ){
//            unicode = (utf8Bytes[pos] & 0xF) << 18;
//            unicode |= (utf8Bytes[pos+1] & 0x3F) << 12;
//            unicode |= (utf8Bytes[pos+2] & 0x3F) << 6;
//            unicode |= (utf8Bytes[pos+3] & 0x3F);
//            unicodeStr+= String.fromCharCode(unicode) ;
//            pos += 4;
//
//        } else if ((flag &0xE0) === 0xE0 ){
//            unicode = (utf8Bytes[pos] & 0x1F) << 12;;
//            unicode |= (utf8Bytes[pos+1] & 0x3F) << 6;
//            unicode |= (utf8Bytes[pos+2] & 0x3F);
//            unicodeStr+= String.fromCharCode(unicode) ;
//            pos += 3;
//
//        } else if ((flag &0xC0) === 0xC0 ){ //110
//            unicode = (utf8Bytes[pos] & 0x3F) << 6;
//            unicode |= (utf8Bytes[pos+1] & 0x3F);
//            unicodeStr+= String.fromCharCode(unicode) ;
//            pos += 2;
//
//        } else{
//            unicodeStr+= String.fromCharCode(utf8Bytes[pos]);
//            pos += 1;
//        }
//    }
//    return unicodeStr;
//}
//
//function str2ab(message) {
//	var bytes = [];
//    for (var i = 0; i < message.length; i++) {
//        var charCode = message.charCodeAt(i);
//        var cLen = Math.ceil(Math.log(charCode)/Math.log(256));
//        for (var j = 0; j < cLen; j++) {
//            bytes.push((charCode << (j*8)) & 0xFF);
//        }
//    }
//    var buffer = new ArrayBuffer(message.length);
//    var intView = new Int8Array(buffer);
//    for(i = 0; i < intView.length; i++){
//        intView[i]=bytes[i];
//    }
//    return intView;
//}

