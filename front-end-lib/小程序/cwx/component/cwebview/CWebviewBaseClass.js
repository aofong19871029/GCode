import { cwx, CPage } from '../../cwx.js';
var __global = require('../../ext/global.js');
/**
 * @module cwx\CWebviewBase
 * @constructor
 * @example import { cwx, CPage } from '../../cwx.js';
var __global = require('../../ext/global.js');

// cwx/component/cwebview/cwebview.js
var CWebviewBase = require( 'CWebviewBaseClass.js');
class CWebview extends CWebviewBase {
}
new CWebview().register();
 */
class CWebviewBase {
    constructor(){
        var proto = this.__proto__;
        while(proto = proto.__proto__){
            Object.assign(this, proto)
        }
        this.constructor = this.__proto__.constructor;
    }
    register(){
        var clone = Object.assign({},this);
        delete clone.constructor;
        CPage(clone)
    }
}
/*
 * public property
 *
 */
Object.assign(CWebviewBase.prototype, {

    /**
     * 分享数据
     */
    shareData: {
        bu:       '',
        title:    '',
        path:     '',
        imageUrl: '',
        desc:     '',
        customer: null
    },

    /*
     * 页面的初始数据
     */
    data: {
      canWebView: cwx.canIUse('web-view'),
      pageName: 'cwebview',
      url: '',
      wsg: '',
      envIsMini: true,    //true 小程序 ，false为h5跳转
      isNavigate: true,   //跳转方式
      loginErrorUrl: '',  //登录失败自定义显示地址  默认：url值
    },

    showUrlError: function(){
      this.setData({
        url: '',
        wsg: '目标地址出了点问题，请重新打开该页面'
      })
    },

    /*
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var data = options.data;
      if(typeof data === 'string'){
        try{
          data = JSON.parse(data);
        }catch(e){
	        try {
		        //添加一层解析
		        data = JSON.parse(decodeURIComponent(data));
	        }catch (e) {
		        this.showUrlError()
	        }
        }
      }
      try{
          var t= {};
          for(var p in data){
            if(data[p]){
              t[p] = data[p];
            }
          }
          this.setData(t);
      }catch(e){
          //
          console.error('onload assign', e)
      }
      var url = data.url || options.url;
      var hideShareMenu =  data.hideShareMenu || options.hideShareMenu;
      if(!!hideShareMenu){
        wx.hideShareMenu();
      }
      url = decodeURIComponent(url)
      if ( url.length <= 0){
        this.showUrlError()
        return
      }
      var needLogin = data.needLogin;
      var envIsMini = data.envIsMini || false
      var isNavigate = true   //默认true
      if (typeof data.isNavigate != 'undefined'){
        isNavigate = data.isNavigate
      }
      var loginErrorUrl = decodeURIComponent((data.loginErrorUrl || url))
      this.setData({
        envIsMini: envIsMini,
        isNavigate: isNavigate,
        loginErrorUrl: loginErrorUrl
      })
      /**
       * 合并处理shareData
       */
      if(data.shareData){
        this.shareData = Object.assign(this.shareData, data.shareData);
      }

      if(!needLogin){
        var auth = cwx.user.auth
        if (!auth || auth.length<=0){ //没有登录每次去除登录态
          url = this.getLoginTokenUrl('',url)
        }
        this.webLoadUrl(url)
      }else{
        this.webGetToken(url)
      }
    },

    /*
     * 加载页面
     */
    webLoadUrl: function(url){
      this.setData({
        url: this.urlRewrite(url)
      })
      console.error('webview load url is', this.data.url);
    },

    /*
     * 将要获取token
     */
    webGetToken: function(url) {
      var auth = cwx.user.auth
      if(auth.length >0){
        this.webGetTokenByAuth(url,auth)
      }else{
        this.webToLogin(url)
      }
    },

    /*
     * 跳登录获取toekn
     */
    webToLogin: function(url){
      var self = this
      cwx.user.login({
          param: this.data,
        callback: function () {
          var auth = cwx.user.auth
          if(auth.length>0){
            self.webGetTokenByAuth(url, auth)
          }else{
            self.loginedErrorHandler() //
          }
        }
      });
    },

    /*
     * auth 获取token (token 有效时间2分钟)
     */
    webGetTokenByAuth: function(url,auth){
      var self = this;
      self.showLoading('');
      cwx.user.getCrossToken(function (crossToken, innerError) {
        self.hideLoading();
        try {
          self.ubtTrace(130705, {
            token: crossToken,
            innerError: innerError
          });
        } catch (e) {
          console.error(e);
        }
        if (innerError) {
          self.loginedErrorHandler(url);
          cwx.showToast({title: '登录失败', icon: 'none'});
        } else {
          if (crossToken == 'undefined' || !crossToken || !/[^\s]/.test(crossToken)) {
            self.webToLogin(url);
          } else {
            let newUrl = self.getLoginTokenUrl(crossToken, url);
            self.webLoadUrl(newUrl)
          }
        }
      });
    },

    /**
    * 获取token也页地址
    */
    getLoginTokenUrl: function(token,url){
      var host = '';
      if (__global.env.toLowerCase() === 'uat') {
        host = 'accounts.uat.qa.nt.ctripcorp.com'
      } else if (__global.env.toLowerCase() === 'fat') {
        host = 'accounts.fat466.qa.nt.ctripcorp.com';
      } else {
        host = 'accounts.ctrip.com'; //生产
      }
      var currentHost = "https://" + host;
      //var newUrl = currentHost + '/H5Login/writecrossticket?ctok=' + token + '&backurl=' + encodeURIComponent(url)
      var newUrl = currentHost + '/H5Login/writecrossticket?ctok=' + token + '&backurl=' + encodeURIComponent(this.urlRewrite(url))
      console.warn('newUrl', newUrl);
      return newUrl
    },

    /**
    * 授权失败操作
    */
    loginedErrorHandler: function () {
        var self = this;
      var loginErrorUrl = this.data.loginErrorUrl
      if (this.data.isNavigate) {
        // if (this.data.envIsMini) {
        // } else { //h5跳转
        // }
        cwx.navigateBack()
      } else if (!this.data.isNavigate) {
        this.webLoadUrl(loginErrorUrl) //redirect方式 登录失败 加载loginErrorUrl
      }
    },

    /**
    * web回调数据
    */
    webPostMessage: function (e) {
      console.log('data:' + e)
      var postArr =  e.detail.data;
      var postCount = postArr.length
      for (var i = 0 ; i < postCount; i ++){
        var sData = postArr[i]
        if (sData.type.toLowerCase() === 'onshare'){
          this.shareData = sData.shareData;
        }
      }
    },

    hideLoading: function () {
      try {
        cwx.hideToast();
        cwx.hideLoading();
      } catch (err) {

      }
    },
    showLoading: function (title) {
      title = title || '';
      try {
        cwx.showLoading({
          title: title,
          mask: true
        });
      } catch (err) {
        cwx.showToast({
          title: title,
          icon: 'loading',
          duration: 10000,
          mask: true
        });
      }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.invokeCallback({ "ReturnCode": "-1", "Message": "返回操作" })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (options) {
      if (!this.shareData.title){
        this.shareData.title = '携程订酒店机票火车票汽车票门票'
      }
      if (!this.shareData.path){
        this.shareData.path = 'pages/home/homepage'
      }
      return this.shareData
    },
    /**
     * urlrewrite
     */
    urlRewrite: function (h5url) {

      var unionData = cwx.mkt.getUnion()
      var { allianceid = '', sid = '', ouid = '', sourceid = '' } = unionData

      h5url = h5url.replace(/[\u4e00-\u9fa5]+/g, function (str) { return encodeURIComponent(str) })
      /**
       * 注入小程序自带的参数
       */
      if (/\?.+/.test(h5url)) {
        h5url += `&fromminiapp=weixin&allianceid=${allianceid}&sid=${sid}&ouid=${ouid}&sourceid=${sourceid}&_cwxobj=${this.getEnv()}`;
      } else if (!/\?/.test(h5url)) {
        h5url += `?fromminiapp=weixin&allianceid=${allianceid}&sid=${sid}&ouid=${ouid}&sourceid=${sourceid}&_cwxobj=${this.getEnv()}`;
      }
      console.warn('urlRewrite', h5url)

      return h5url;
    },
    getEnv: function(){
        var re = cwx.defaultEnvObject || {};
        re.mpopenid = cwx.cwx_mkt && cwx.cwx_mkt.openid || "";

        try{
          let unionData = cwx.mkt.getUnion();
          re.allianceid = unionData.allianceid.toString();
          re.sid = unionData.sid.toString();
          re.ouid = unionData.ouid.toString();
          re.sourceid = unionData.sourceid.toString();
          //re.referrerInfo = cwx.referrerInfo;
          re.scene = cwx.scene;
        }catch(e){
          console.error('getEnv', e);
        }

        var reStr = encodeURIComponent(JSON.stringify(re));
        return reStr;
    }
})

cwx.defaultEnvObject = {
    cid: cwx.clientID,
    appid: __global.appId
}
cwx.setEnvObject = function(o){
    Object.assign(cwx.defaultEnvObject, o)
}
module.exports = CWebviewBase
