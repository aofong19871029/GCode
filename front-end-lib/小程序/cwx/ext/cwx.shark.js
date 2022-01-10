var __global = require('./global.js');
var cwx = __global.cwx;
/**
 * 摇一摇接口
 * @module cwx/shark
 */
var shark = {
    init: function(){
        try{
            cwx.sharkShark = false;
            wx.onAccelerometerChange(function (res) {
                  //console.log(res.x)
                    //console.log(res.y)
                   // console.log(res.z)
                    if ((res.x > 1.5 || res.y > 1.5 || res.z > 1.5) && cwx.sharkShark == false) {
                        cwx.sharkShark = true;
                      // wx.showToast({
                      //   title: '摇一摇成功',
                      //   icon: 'success',
                      //   duration: 2000
                      // })
                        console.log('尝试进入摇一摇模式!');
                        try{
                            clearTimeout(cwx.timeoutCLearShark);
                            try{
                                var curPage = cwx._wxGetCurrentPages[cwx._wxGetCurrentPages.length -1];
                                console.error('curPage',curPage)
                                if(cwx._shakeTriggerMap && cwx._shakeTriggerMap[curPage.__route__]){
                                    console.log('尝试进入当前页面注册的sharkCB!');
                                    cwx._shakeTriggerMap[curPage.__route__]();
                                }else{
	                                if(cwx.clientID && cwx.clientID.length){
		                                //此处改成通过AB获取白名单
		                                cwx.ABTestingManager.fetchABService(cwx.clientID, function(){
			                                var testAB = cwx.ABTestingManager.valueForKeySync("200324_MKT_weix");
			                                console.log("----------testAB-----",testAB);
			                                if(testAB === "B"){
				                                console.error('debugger mode开启');
				                                wx.navigateTo({
					                                url: '/pages/home/testconfig'
				                                })
			                                }else{
				                                console.warn('设备暂未申请测试页白名单，请联系产品!  clientId: ',cwx.clientID)
			                                }
		                                })
                                  }else{
		                                console.error('暂未获取ClientId，请稍后再试');
                                  }

                                    // wx.getConnectedWifi({
                                    //     success: function(w){
                                    //         cwx.WifiInfo = w;
                                    //         console.log('已连接wifi', w)
                                    //         if(cwx.WifiInfo && cwx.WifiInfo.wifi && cwx.WifiInfo.wifi.SSID == 'DEV'){
                                    //             wx.navigateTo({
                                    //                 url: '/pages/home/testconfig'
                                    //             })
                                    //         }
                                    //     }
                                    // })
                                }
                            }catch(e){
                                console.error('_shakeTriggerMap报错', e)
                            }
                        }catch(e){
                            console.error('摇一摇报错', e)
                        }finally{
                            cwx.timeoutCLearShark = setTimeout(function(){
                                cwx.sharkShark = false;
                            }, 1000)
                        }
                   }
              })
              wx.onWifiConnected(function(w){
                cwx.WifiInfo = w;
                console.log('已连接wifi', w)
              })
        }catch(e){
            console.error('摇一摇模块初始化遇到问题', e)
        }
    }
}


module.exports = shark;
