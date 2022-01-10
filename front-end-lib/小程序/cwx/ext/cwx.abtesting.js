import { cwx, __global} from "../cwx.js"
var ubt = require('../cpage/ubt_wx.js')

/**
 * auth: tczhu
 * breif: 提供ABTesting功能
 * @module cwx/abtesting
 **/
var ABTestingManager = (function () { 
  var single;

  //获取ABTesting实例
  var manager = function(){
    if(!single){
      single = {};
    }
    single.fetchABService = fetchABService
    single.valueForKeySync = valueForKeySync
    single.valueForKeyAsync = valueForKeyAsync
    single.watch = watch
    return single;
  }

  //存储到本地
  var setLocalStore = function(ob){
    wx.setStorageSync('ABTestingManager',ob)
  }

  //根据试验号获取Value,同步
  var valueForKeySync = function(key){
    var abs = wx.getStorageSync("ABTestingManager");
    if(abs){
      for(var i = 0;i < abs.length; i++ ){
        var ab = abs[i];
        if (ab.expCode == key){

          ubt.ubtTrace('o_abtest_expresult_weixin', ab.expResult)
          return ab.abValue;
        }
      }
    }
    return null;
  }
  //异步获取试验号
  var valueForKeyAsync = function(key,callback){
    wx.getStorage({
      key: 'ABTestingManager',
      success: function(res) {
        if(!res || !res.data){
          return;
        }
        var abs = res.data;
        var value = null
        for (var i = 0; i < abs.length; i++) {
          var ab = abs[i];
          if (ab.expCode == key) {
            value = ab.abValue

            ubt.ubtTrace('o_abtest_expresult_weixin', ab.expResult)
            break
          }
        }
        
        callback && callback(value);
      },
    })
  }
  
  var ABResutl = {};
  var ABResultExpResult = [];
  //AB服务
  var fetchABService = function(cid, cb){
    wx.request({
      //url: 'https://m.ctrip.com/restapi/soa2/12378/getWeixinABData',
      url: 'https://m.ctrip.com/restapi/soa2/16647/getABTestData',
      data:{
        "expCodes": "",
        "clientID": cwx.clientID,
        "appId": "5003",
        "lastUpdateTime": "",
        "supplementList": [""],
        "head": {
          "syscode": "",
          "lang": "String",
          "auth": "String",
          "cid": "String",
          "ctok": "String",
          "cver": "",
          "sid": "String",
          "extension": [{
            "name": "String",
            "value": "String"
          }],
          "pauth": "String",
          "sauth": "String",
          "appid": ""
        }
      },
      method:'POST',
      success:function(res){
        if(res.statusCode == "200" && res.data && res.data.Result){
          console.warn('ABTest读取结果为');
          console.warn(res.data.Result);
          var abs = [];
          try{
            abs = JSON.parse(res.data.Result);
          }catch(e){}
          for(var i = 0;i < abs.length; i++ ){
            var ab = abs[i];
            ABResutl[ab.ExpCode] = ab.ExpVersion;
            ABResultExpResult.push({
              expCode: ab.ExpCode,
              abValue: ab.ExpVersion,
              expResult: ab.ExpResult
            })
          }
          for(var k in watchDic){
            if(watchDic[k].length){
              var fn;
              while(fn=watchDic[k].pop()){
                fn(ABResutl[k])
              }
            }
          }
          setLocalStore(ABResultExpResult);
        }
        cb && cb()
      },
      fail:function(res){
        console.log('fail res = ', res)
      }
    })
  }
  var watchDic = {};
  function watch(key, callback){
    watchDic[key] = watchDic[key] || [];
    watchDic[key].push(callback);
    if(key in ABResutl){
      var fn;
      while(fn = watchDic[key].pop()){
        console.error(fn)
        fn(ABResutl[key])
      }
    }
  }
  
  return manager();

})();



module.exports = ABTestingManager;