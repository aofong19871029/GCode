/**
 * 页面分享组件
 * @module cwx/share
 */
var __global = require('./global.js'); 
var cwx = require('../cwx.js'); 

var share = {
    init: function(){
        try{
            cwx.capture = false;     
            wx.onUserCaptureScreen(function (res) {
                    if (cwx.capture == false) {
                        cwx.capture = true;
                      // wx.showToast({
                      //   title: '摇一摇成功',
                      //   icon: 'success',
                      //   duration: 2000
                      // })
                        console.log('尝试进入截屏分享模式!');
                        clearTimeout(cwx.timeoutCLearCapture);
                        
                        wx.showModal({
                            title: '我想把当前页分享给',
                            confirmText: '微信好友',
                            cancelText : '朋友圈',
                            success: function(){
                                
                            },
                            fail: function(){
                                
                            }
                        })
                        try{
                            
                            try{
                                var curPage = cwx._wxGetCurrentPages[cwx._wxGetCurrentPages.length -1];
                                console.error('curPage',curPage)
//                                if(cwx._shakeTriggerMap && cwx._shakeTriggerMap[curPage.__route__]){
//                                    console.log('尝试进入当前页面注册的sharkCB!');
//                                    cwx._shakeTriggerMap[curPage.__route__]();
//                                }else{
//                                    console.error('debugger mode开启');
//                                    wx.getConnectedWifi({
//                                        success: function(w){
//                                            cwx.WifiInfo = w;
//                                            console.log('已连接wifi', w)
//                                            if(cwx.WifiInfo && cwx.WifiInfo.wifi && cwx.WifiInfo.wifi.SSID == 'DEV'){
//                                                wx.navigateTo({
//                                                    url: '/pages/home/testconfig'
//                                                })
//                                            }
//                                        }
//                                    })
//                                }
                            }catch(e){
//                                console.error('_shakeTriggerMap报错', e)
                            }  
                        }catch(e){
                            console.error('截屏分享报错', e)
                        }finally{
                            cwx.timeoutCLearCapture = setTimeout(function(){
                                cwx.capture = false;
                            }, 2000)
                        }
                   }
              })
              wx.onWifiConnected(function(w){
                cwx.WifiInfo = w;
                console.log('已连接wifi', w)
              })
        }catch(e){
            console.error('截屏分享模块初始化遇到问题', e)
        }
    }
}


module.exports = share;