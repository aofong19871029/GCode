/**
 * @module cwx/request
 */
var __global = require('./global.js');
var cwx = __global.cwx;

var useSocket = 0;

var cwxscoket = require('../ext/cwx.socket.js');

if(cwx.clientID && cwx.clientID.length){
	isUseSocket();
}else{
	cwx.Observer.addObserverForKey('CIDReady', function(){
		isUseSocket();
	})
}
function isUseSocket(){
	//console.error(cwx.clientID);
	var url = 'https://m.ctrip.com/restapi/socketio/abService/getConfig?version=4&cwxClientId=' + cwx.clientID;
	if(__global.env.toLowerCase() === 'uat'){
		url = 'https://gateway.m.fws.qa.nt.ctripcorp.com/restapi/socketio/abService/getConfig?version=4&cwxClientId=' + cwx.clientID;
		//console.error('uat');
	}
	wx.request({
		url: url,
		method: "GET",
		success: function(res){
			if (res.statusCode == 200 && res.data){
				res = res.data;
				//console.error(res);
				try{
					if(typeof(res) == 'string'){
						res = JSON.parse(res);
					}
					//console.error(res);
					useSocket = res.ABTesting;
					if(useSocket == 0 || useSocket == 'False' || useSocket == '0'){
					    cwx._useSocket = '0';
					    wx.setStorageSync('globalUseSocket', '0');
					}else{
					    cwx._useSocket = '1';
					    wx.setStorageSync('globalUseSocket', '1');
					}
					// useSocket = 0;
				}catch(e){
					console.warn(e);
				}
			}
		}
	})
}

var requestd = {};
var _requestID = 1;
var __kMaxRequestCount = 9;
var _requestQueue = [];//等待的queue
var _runQueue = [];//正在请求的request

function _generateRequestID() {
    return _requestID++;
}

function _formatRequestURL( url ) {
    if( url.indexOf( "/" ) != 0 || url.indexOf( "http" ) == 0 ) { //联调完去掉这个判断
      if (url.indexOf("gateway.secure.ctrip.com") == -1){
          console.log("警告：请使用相对路径 ", url);
        }
        return url;
    }
    var scheme = 'https://';
    var host = __global.host
    if(__global.env.toLowerCase() === 'uat'){
        host = __global.uat;
        scheme = 'http://';
    } else if (__global.env.toLowerCase() === 'fat'){
        host = __global.fat;
        scheme = 'http://';
    }
  return scheme + host + url;
}

function __createHeader( header ) {
    var _header = header || {};
    try {
    	  //新增四个默认的header
    	  _header["x-ctx-locale"] = "zh-CN";
    	  _header["x-ctx-group"] = "ctrip";
    	  _header["x-ctx-region"] = "CN";
    	  _header["x-ctx-currency"] = "CNY";
        var _mktCookie = cwx.mkt.getUnionForCookie();
        if( _mktCookie ) {
            _header.Cookie = _mktCookie + ";" + ( _header.Cookie || "" );
        }
        if(cwx.cwx_mkt && cwx.cwx_mkt.openid){
            //console.error('recoard opejndasd')
            _header['x-wx-openid'] = cwx.cwx_mkt.openid;
        }
        if(__global.env != 'prd'){
            _header['x-wx-env'] = 'dev';
        }
    } catch( e ) {
        // console.log( "__createHeader error = ", e );
    }
    return _header;

}
/**
 * //取消队列中的请求//2016.10.24 只能移除等待队列中的请求
 * @function
 * @param {number} requestID
 */

function cancel( requestID ) {
    if( requestID > 0 ) {
        //等待中移除
        for( var i = 0;i < _requestQueue.length;i++ ) {
            var obj = _requestQueue[ i ];
            if( obj.requestID == requestID ) {
                _requestQueue.splice( i, 1 );
                return 1;
            }
        }
    }

    return 0;
}

//发送网络请求, 异步返回结果，函数返回值为本次请求生成的requestID， 该requestID在cancel时候可以使用
/**
 * @name _request
 * @function
 * @param {map} object
 */
function request( object ) {
    var header = __createHeader( object.header );
    object.header = header;
    // console.log( "request header = ", object.header );
    if( !object.data ) {
        object.data = {};
    }
    var data = object.data;

    var auth = ""
    if( cwx.user && cwx.user.auth ) {
        auth = cwx.user.auth
    }
    object.url = _formatRequestURL( object.url );
    // console.log( "cwx.request.url==" + object.url );
    object.method = object.method || 'POST';
    object.requestID = _generateRequestID();


    var oComplete = object.complete || function() { };
    var nComplete = function( res ) {
        //移除请求
        for( var i = 0;i < _runQueue.length;i++ ) {
            var obj = _runQueue[ i ];
            if( obj.requestID == nComplete.requestID ) {
                _runQueue.splice( i, 1 );
                break;
            }
        }

        var page = cwx.getCurrentPage();

        var page = cwx.getCurrentPage();
        if (page && page.ubtMetric && res) {
          var ubt_metric = {
            name: 100371,
            tag: {
              status: 'fail',
              rootMessageId: res.header && (res.header.rootmessageid || res.header.RootMessageId || ''),
              url: object.url,
              statusCode: '' + (res && res.statusCode || 'na')
            },
            value: +new Date() - nComplete.startTime
          };

          if (res.statusCode && res.statusCode * 1 < 400) {
            ubt_metric.tag.status = 'success';
          }

          page.ubtMetric(ubt_metric);
        }




        if( oComplete ) {
            oComplete( res );
        }
        setTimeout( function() {
            //等待队列吐出请求
            // console.log( "before ", _runQueue.length, " wait = ", _requestQueue.length );
            if( _requestQueue.length > 0 ) {
                var nextRequestObject = _requestQueue.splice( 0, 1 )[ 0 ];
                _runQueue.push( nextRequestObject );
                wx.request( nextRequestObject );
            }
            // console.log( "after ", _runQueue.length, " wait = ", _requestQueue.length );
        }, 0 );

    }

    nComplete.startTime = +new Date();
    nComplete.requestID = object.requestID;
    object.complete = nComplete;
    //默认的head
    var _head = {
        cid: cwx.clientID,
        ctok: '',
        cver: __global.version,
        lang: '01',
        sid: '',
        syscode: ( cwx.systemCode || "" ).toString(),
        auth: auth,
        sauth: '',
    };
    if( data && data.head ) {
        Object.keys( data.head ).forEach( function( pro ) {
            _head[ pro ] = data.head[ pro ];
        })
    }

    if(typeof _head.extension == "undefined"){
      _head.extension = []
    }

    var scene = (cwx.scene || "") + ""
    _head.extension.push({"name":"appId","value": cwx.appId || ""});
    _head.extension.push({"name":"scene","value": scene});

    data.head = _head;

    //tczhu 添加一个正在请求的队列
    if( _runQueue.length >= __kMaxRequestCount ) {
        // console.log("加入等待队列 ",object);
        _requestQueue.push( object );
    } else {
        _runQueue.push( object );
        wx.request( object );
    }

    return object.requestID;
}

/**
 * @name request
 * @function
 * @param {map} parms
 */
requestd.request = function(object){
	//console.error(useSocket)
	//if(/^\/(restapi|framework)/i.test(object.url) && useSocket && cwxscoket.isEnable()){
  //   if(object.isSocket != false && /^\/(restapi|framework)/i.test(object.url) && cwx.useSocket == '1' && cwxscoket.isEnable()){

	// 	return cwxscoket.request.apply(this, arguments);
	// }
	return request.apply(this, arguments);
};
requestd._request = request;

requestd.cancel = cancel;

module.exports = requestd;
