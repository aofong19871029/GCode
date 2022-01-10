/***
 * @file 该文件用来装载cwx新增的方法
 */
import { ubtMetric } from "../cpage/ubt_wx.js";
var debugLog = true ? console.log : function(){};

var KGOTOAPPID = "101177" //跳转到外部小程序
var kBACKTOAPPID = "101175" //回退到小程序


module.exports = function(cwx){
  
  function load_ubtMetric(options){
    ubtMetric && ubtMetric({
      name: options.name,
      value:1,
      tag: options.tag,
      callback: options.callback
    })
  }
  /** 跳转到别的小程序 */
  cwx.cwx_navigateToMiniProgram = function(options){
    if (!wx.navigateToMiniProgram){
        debugLog("微信版本过低，不支持跳转")
        options && options.complete && options.complete()
        return;
    }
    var wrapOptions = options
    try{
      //拼接市场的参数业绩参数
      var sep = "&"
      if (wrapOptions.path.indexOf("?") == -1) {
        sep = "?"
      }
      wrapOptions.path += sep + cwx.mkt.getReferrerUnion()
    }catch (e){

    }

    var page = cwx.getCurrentPage()
    
  /** 埋点的参数 */
    var tag = {
                "fromPath": (page && page.__route__) || "",
                "toPath": wrapOptions.path, 
                "from": cwx.appId, 
                "to": wrapOptions.appId ,
                }

    /** wrap success */
    var origin_suc = wrapOptions.success
    wrapOptions.success = function(res){
      origin_suc && origin_suc(res)
      tag.result = 1;
      tag.errMsg = (res && res.errMsg) || ""
      load_ubtMetric({
        name: KGOTOAPPID,
        tag:tag,
        callback:function(res){
          debugLog("跳转成功 ： res = ",res , " tag = ",tag)
        }
      })
    }
    var origin_fail = wrapOptions.fail
    wrapOptions.fail = function(res){
      origin_fail && origin_fail(res)
      tag.result = 0;
      tag.errMsg = (res && res.errMsg) || ""
      load_ubtMetric({
        name: KGOTOAPPID,
        tag:tag,
        callback:function(res){
          debugLog("跳转失败 ： res = ",res , " tag = ",tag)
        }
      })
    }

    wx.navigateToMiniProgram(wrapOptions)
  }
  /** 返回到源小程序 */
  cwx.cwx_navigateBackMiniProgram = function(options){
    if (!wx.navigateBackMiniProgram){
      debugLog("微信版本过低，不支持回退")
      return
    }
    var wrapOptions = options
    var page = cwx.getCurrentPage()

    /** 埋点的参数 */
    var tag = {
      "fromPath": (page && page.__route__) || "",
      "from": cwx.appId,
    }
    /** wrap success */
    var origin_suc = wrapOptions.success
    wrapOptions.success = function (res) {
      origin_suc && origin_suc(res)
      tag.result = 1;
      tag.errMsg = (res && res.errMsg) || ""
      load_ubtMetric({
        name: kBACKTOAPPID,
        tag: tag,
        callback: function (res) {
          debugLog("回退成功 ： res = ", res, " tag = ", tag)
        }
      })
    }
    var origin_fail = wrapOptions.fail
    wrapOptions.fail = function (res) {
      origin_fail && origin_fail(res)
      tag.result = 0;
      tag.errMsg = (res && res.errMsg) || ""
      load_ubtMetric({
        name: kBACKTOAPPID,
        tag: tag,
        callback: function (res) {
          debugLog("回退失败 ： res = ", res, " tag = ", tag)
        }
      })
    }

    wx.navigateBackMiniProgram(wrapOptions)

  }

}