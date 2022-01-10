/**
 * @file cwx初始化文件，请求openid等操作
 */
import { ubtMetric } from "../cpage/ubt_wx.js";
import { cwx, __global} from "../cwx.js"
var configService = require('cwx.config.js')
cwx.configService = configService;

var kCIDSuccessMetricName = "100963" //CID获取成功埋点
var kCIDFailtureMetricName = "100964" //CID获取失败埋点
var kCIDServerRetryCount = 100; //CID 服务失败重试次数
var kCIDServerRetryTimestamp = 50;//CID 服务重试间隔
var DebugLog = false ? console.log : function(){};

module.exports = function () {
  cwx.config.init();
  //摇一摇注册
    console.log('注册摇一摇事件')
    var shark = require('cwx.shark.js');
    shark.init()
    
    
  var CIDCallback = function (value) {
    console.warn('获取到的本机cid是', value)
    /** 获取cid之后获取ab,openid */
    cwx.ABTestingManager.fetchABService(value, function(){
      cwx._homeABTest = cwx.ABTestingManager.valueForKeySync("180828_idh_wsypk")
      console.warn('首页的ab版本第二次确认为', cwx._homeABTest)
    })
    setTimeout(function(){
        cwx.cwx_mkt._getMarketOpenIDHash(function () {
            console.error('cwx.cwx_mkt.openid = ', cwx.cwx_mkt.openid)
            cwx.Observer.noti("OpenIdObserver", cwx.cwx_mkt.openid)
          })  
    },0)
    
    try{
      configService.run();
    }catch(e){
      console.error(e);
    }
    /**
     * 自动上报地址
     */
    try{
      var frequency = 0;
      var lbs_timer;
      cwx.configService.watch('lbsnew', function(t){
        clearInterval(lbs_timer);
        frequency = parseFloat(t.time)
        function locLog(){
          
          cwx.locate.startGetCtripCity(function(res){
            var reqData
            if(res.data && res.data.pOIInfo && res.data.pOIInfo.longitude){
              reqData = {
                  "head": {
                    "syscode": "",
                    "lang": "",
                    "auth": "",
                    "cid": cwx.clientId,
                    "ctok": "",
                    "cver": __global.cversion,
                    "sid": "",
                    "extension": [
                      {
                        "name": "",
                        "value": ""
                      }
                    ],
                    "sauth": ""
                  },
                  "location": {
                    "country": res.data.pOIInfo.country || null,
                    "province": res.data.pOIInfo.province || null,
                    "city": res.data.pOIInfo.city || null,
                    "district": res.data.pOIInfo.district || null,
                    "detailAddress": res.data.pOIInfo.formattedAddress || null,
                    "latitude": res.data.pOIInfo.latitude || null,
                    "longitude": res.data.pOIInfo.longitude || null,
                    "extension": ""
                  },
                  "deviceProfile": {
                    "appId": "5003",
                    "token": "",
                    "clientId": cwx.clientId,
                    "platform": 0,
                    "openUUID": cwx.user.uuid,
                    "iMEI": "",
                    "mAC": "",
                    "iDFA": "",
                    "vendor": "",
                    "deviceType": "",
                    "deviceName": "",
                    "oS": "",
                    "oSVersion": "",
                    "androidId": "",
                    "appVersion": "",
                    "sourceId": "",
                    "pushSwitch": 0,
                    "appPushSwitch": 0,
                    "marketPushSwitch": 0,
                    "extension": ""
                  },
                  "wifiList": [
                    {
                      "bSSID": "",
                      "sSID": ""
                    }
                  ],
                  "baseStationList": [
                    {
                      "mCC": "",
                      "mNC": "",
                      "lAC": "",
                      "cID": ""
                    }
                  ],
                  "extension": ""
                }
            }
              
            
            cwx.request({
              url: "/restapi/soa2/13556/json/uploadLocation",
              method: "POST",
              data: reqData,
              success: function (res) {
                console.warn("auto loc report submit success!"+ new Date().toString()+"frequency is "+frequency+" minutes");
                console.warn(res)
              },
              fail: function () {
                console.warn("auto loc report submit fail!do nothing");
              }
            });
          });
        }
        function autoLog(){
          console.warn('准备上报LBS')
          wx.getSetting({
            success(res) {
                console.warn('用户权限设置如下');
                console.warn(res.authSetting)
                if (res.authSetting['scope.userLocation']) {
                  locLog()
                }
            }
          })
        }
        
        if(frequency>0){
          autoLog();
          lbs_timer = setInterval(autoLog, frequency*1000*60)
          //lbs_timer = setInterval(autoLog, 12000)
          //时间按分钟算
        }
      })
    }catch(e){
      console.error(e)
    }
  }

  cwx.Observer.addObserverForKey('CIDReady', CIDCallback)
  var notiCID = function (cid) {
    cwx.Observer.noti("CIDReady", cid)
  }
  //获取ClientID

  requestCID(cwx, 1, function (cid) {
    DebugLog("noti...cid 1")
    if (cid && cid.length) {
      DebugLog("noti...cid 2")
      notiCID(cid)
    }
  })
  //提早触发
  cwx.cwx_mkt._getMarketOpenIDHash(function () {
      console.error('cwx.cwx_mkt.openid = ', cwx.cwx_mkt.openid)
      cwx.Observer.noti("OpenIdObserver", cwx.cwx_mkt.openid)
    })
  
}


/** private */
var requestCID = function (cwx, retryCount, callback) {//retryCount 重试次数
  DebugLog("requestCID 请求CID ： ", retryCount)

  if(retryCount > kCIDServerRetryCount){
     callback && callback("");
     DebugLog("requestCID 超多最大重试次数 ： ",retryCount)
    return;
  }
  //获取ClientID
  var clientID = wx.getStorageSync("clientID")

  if (clientID && clientID.length) {
    DebugLog("requestCID CID 获取缓存 ： ", retryCount, " cid : ", clientID)
    cwx.clientID = clientID
    callback && callback(clientID)
 

    /** CID 获取成功*/
    ubtMetric({
      name: kCIDSuccessMetricName,
      value: 1,
      tag: { "statusCode": "200", "cid": clientID, "retryCount": retryCount, 'useCache': 1, "appId": __global.appId },
      callback: function (response) {
        DebugLog("Debug CID : ", kCIDSuccessMetricName, " response = ", response)
      }
    })
    return;
  }

  var fail = function (res) {
    cwx.clientID = "";
    /** CID 获取失败*/
    var tag = { "statusCode": (res && res.statusCode) || "", "system": cwx.wxSystemInfo.system, "platform": cwx.wxSystemInfo.platform, "wxVersion": cwx.wxSystemInfo.version, "retryCount": retryCount, "appId": __global.appId }
    tag.errMsg = (res && res.errMsg) || ""
    tag.model = cwx.wxSystemInfo.model || ""
  
    ubtMetric({
      name: kCIDFailtureMetricName,
      value: 1,
      tag: tag,
      callback: function (response) {
        DebugLog("Debug CID : ", kCIDFailtureMetricName, " response = ", response , " tag = ",tag)
      }
    })
    DebugLog("requestCID CID 获取服务失败 ： ", retryCount, " cid : ", cwx.clientID, " statusCode " , (res && res.statusCode) || "")
    setTimeout(function () {
      requestCID(cwx, retryCount + 1, callback)
    }, kCIDServerRetryTimestamp)
  };
  var success = function (res) {
    if (res.statusCode == 200 && res.data && res.data.ClientID && res.data.ClientID.length) {
      cwx.clientID = res.data.ClientID
      wx.setStorage({
        key: "clientID",
        data: res.data.ClientID
      });
      /** CID 获取成功*/
      ubtMetric({
        name: kCIDSuccessMetricName,
        value: 1,
        tag: { "statusCode": res.statusCode, "cid": res.data.ClientID, "retryCount": retryCount, 'useCache': 0, "appId": __global.appId },
        callback: function (response) {
          DebugLog("Debug CID : ", kCIDSuccessMetricName, " response = ", response)
        }
      })
      DebugLog("requestCID CID 获取服务成功 ： ", retryCount, " cid : ", cwx.clientID)
      callback && callback(cwx.clientID)
    } else {
      fail && fail(res)
    }

  }
  cwx.request({
    url:"/restapi/soa2/10290/createclientid",
    method: "POST",
    success: success,
    fail: fail,
  })
  console.warn('查看一下clientid', cwx.clientID);
  
  

}
