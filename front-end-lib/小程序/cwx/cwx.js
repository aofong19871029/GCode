/**
 * @module cwx
 */
var __global = require('./ext/global.js');
var _ = __global._ = require('../3rd/lodash.core.min.js');
var store = require('./ext/cwx.storage.js');

/**
 * @global
 * @see module:cwx
 */
var cwx = __global.cwx = (function () {
  var globalData = {
    bus: {},
    pay: {},
    train: {},
    flight: {},
    home: {},
    hotel: {},
    ticket: {},
    schedule: {},
  }

  var cwx = Object.create(wx, 
  
  {  
    /**
     * @member
     * @see module:cwx\config
     */
    config: {
      get: function(){
        return require('./cpage/config.js');
      },
      enumerable: true
    },
    /**
     * @member
     * @see module:cwx\util
     */
    util: {
      value: require('./ext/util.js'),
      enumerable: true
    },
    /**
     * @member
     * @see module:cwx\request~request
     */
    request: {
      get: function(){
        return require("./ext/cwx.request.js").request;
      },
      enumerable: true
    },
    /**
     * @member
     * @see module:cwx\request~_request
     */
    _request: {
        get: function(){
          return require("./ext/cwx.request.js")._request;
        },
        enumerable: true
      },
    /**
     * @member
     * @see module:cwx\request~cancel
     */
    cancel: {
      get: function(){
        return require("./ext/cwx.request.js").cancel;
      },
      enumerable: true
    },
    /**
     * @member
     * @see module:cwx\locate
     */
    locate: {
      get: function(){
        return require("./ext/cwx.locate.js");
      },
      enumerable: true
    },
    /**
     * @member
     * @see module:cwx\payment
     */
    payment: {
      get: function(){
        return require("../pages/pay/common/cpay.js");
      },
      enumerable: true
    },
    /**
     * @member
     * @see module:cwx\component
     */
    component: {
      get: function(){
        return require("./component/component.js");
      },
      enumerable: true
    },
    user: {
      get: function(){
        return require('../pages/accounts/user.js');
      },
      enumerable: true
    },
    
    passenger: {
      get: function(){
        return require('../pages/passenger/passenger.js');
      },
      enumerable: true
    },
    mkt: {//市场业绩
      get: function(){
        return require('../pages/market/market.js');
      },
      enumerable: true
    },
    /**
     * @member
     */
    appId:{
      enumerable:true,
      value:__global.appId
    },
    /**
     * @member
     */
    cwx_mkt: {//市场需要的id
      get: function () {
        return require('./ext/cwx.market.js');
      },
      enumerable: true
    },
    /**
     * @member
     */
    cwx_htl: {//酒店处理Mvc
      get: function () {
        return require('./ext/cwx.hotel.js');
      },
      enumerable: true
    },
    /**
     * @member
     */
    shareTicket:{//小程序分享到群
      enumerable:true,
      value:null,
      writable:true
    },
    /**
     * @member
     * @see module:cwx\abtesting
     */
    ABTestingManager:{ //ABTesting
      get:function(){
        return require('./ext/cwx.abtesting.js')
      },
      enumerable:true
    },
    /**
     * @member
     * @see module:cwx\observer
     */
    Observer:{
      get:function(){
        return require('./ext/cwx.observer.js')
      },
      enumerable: true
    },
    /**
     * @member
     * @see module:cwx\storage~set
     */
    setStorageSync:{
      get:function(){
        return store.set.bind(store);
      },
      enumerable: true
    },
    /**
     * @member
     * @see module:cwx\storage~remove
     */
    removeStorageSync:{
        get:function(){
          return store.remove.bind(store);
        },
        enumerable: true
    },
    /**
     * @member
     * @see module:cwx\storage~get
     */
    getStorageSync:{
      get:function(){
          return store.get.bind(store);
        },
        enumerable: true
    },
    /**
     * @member
     * @see module:cwx\storage~set
     */
    setStorage:{
        get:function(){
        	return (function(o){
        		store.set(o.key, o.data);
        		o.success && o.success();
        		o.complete && o.complete();
        	}).bind(store);
    	},
        enumerable: true
    },
    /**
     * @member
     * @see module:cwx\storage~remove
     */
    removeStorage:{
          get:function(){
        	return (function(o){
          		store.remove(o.key);
        		o.success && o.success();
        		o.complete && o.complete();
            }).bind(store);
          },
          enumerable: true
    },
    /**
     * @member
     * @see module:cwx\storage~get
     */
    getStorage:{
        get:function(){
        	return (function(o){
        		var v = store.get(o.key);
        		o.success && o.success({key: o.key, data: v});
        		o.complete && o.complete({key: o.key, data: v});
        	}).bind(store);
    	},
          enumerable: true
    },
    /**
     * @member
     * 
     */
    setNavigationBarTitle:{
        get:function(){
            return (function({title}){
                wx.setNavigationBarTitle({
                  title: title || '',
                  success: () => {
                      try{
                          var curPage = cwx._wxGetCurrentPages[cwx._wxGetCurrentPages.length - 1];
                          try{
                              curPage.setData({
                                  'navbarData.title': title || ''
                              })
                          }catch(e){
                              console.error(e)
                          }

                      }catch(e){
                          console.error(e)
                      }
                  }
                })
            });
        },
        enumerable: true
    }
  });
  /**
   * @member
   * @name getCurrentPage
   * @return {page}
   */
  cwx.getCurrentPage = function () {
    var pages, page;
    try {
      pages = getCurrentPages();
      page = pages && pages.length ? pages[pages.length - 1] : null;
    } catch (e) {
      page = getApp().getCurrentPage();
    }
    return page;
  };

  Object.keys(globalData).forEach(function (key) {
    cwx[key] = globalData[key]
  })

  /** 绑定微信版本 */
  /**
   * @member
   * @name wxSystemInfo
   */
  cwx.wxSystemInfo = wx.getSystemInfoSync();
  /**
   * @member
   * @name systemCode
   */
  cwx.systemCode = '30';
  
  Object.defineProperty(cwx,"useSocket",{
      get: function(){
          try{
              var _env = wx.getStorageSync('globalUseSocket');
              if(_env != null && _env.length){
                  //
              }else{
                  _env = '0'
              }
              return _env;
          }catch(e){
              return cwx._useSocket || '0';
          }
      },
      set: function(v){
          try{
              wx.setStorageSync('globalUseSocket', v);
          }catch(e){
              cwx._useSocket = v;
          }
      }
  })
  return cwx;
})()

var CPage = __global.CPage = require('./cpage/cpage.js');
export default cwx;
export { __global };
export { cwx };
export { _ };
export { CPage };


function equalVersion(curV, reqV) {
  var arr1 = curV.split(".");
  var arr2 = reqV.split(".");

  var maxL = Math.max(arr1.length, arr2.length);
  var pos = 0;
  var diff = 0;

  while (pos < maxL) {
    diff = parseInt(arr1[pos]) - parseInt(arr2[pos]);
    console.log(diff, parseInt(arr1[pos]), parseInt(arr2[pos]))
    if (diff != 0) {
      break;
    }
    pos++;
  }
  if (diff > 0 || diff == 0) {
    //新版本、稳定版
    return 1
  } else {
    // 旧版本
    return 0
  }
}

(function load(){
  try {
    let globalData;
    if (global) {
      globalData = global.globalData = global.globalData || {};
    } else {
      let app = getApp();
      globalData = app.globalData = app.globalData || {};
    }

    (function getStatusBarHeight() {
      let res = cwx.wxSystemInfo;
      var customTitleBarHeight;
      try {
        const menuInfo = wx.getMenuButtonBoundingClientRect();
        if (equalVersion(res.version, '7.0.3')) {
          customTitleBarHeight = menuInfo.height + (menuInfo.top - res.statusBarHeight) * 2
        } else {
          customTitleBarHeight = menuInfo.height + menuInfo.top * 2
        }
      } catch (e) {
        customTitleBarHeight = 48
      }
      if (res.model.indexOf('iPhone') !== -1) {
        customTitleBarHeight = 44
      }
      global.globalData.statusBarHeight = res.statusBarHeight
      global.globalData.titleBarHeight = customTitleBarHeight
    })();

    global.cwx = {
      __global,
      cwx,
      CPage,
      _
    }
  } catch (e) {
    console.log('global is not exist');
  }
})()




