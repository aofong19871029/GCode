

import { ubtMetric } from "../cpage/ubt_wx.js";
import { cwx, __global} from "../cwx.js"

/**
 * 从MCD下发配置参数
 * @module cwx/config
 */
var config = {
    store: {},
  keys: ['lbsnew', 'mainpage', 'More', 'tips', 'sale', 'SecondFloor', 'tripShoot', 'street'],
    watchFn: {},
    watchDirty : {},
    isRefreshNow: false,
    lastModified: +(new Date()),
    refreshStore: function(callback){
        if(config.isRefreshNow != true){
            config.isRefreshNow = true;
            var params = {
              "appId": "5003",
              "categoryList": config.keys,// ["LBS"],
              "platform": 2,
              "head" : {
                  "cid": cwx.clientID,
                  "cver": __global.cversion,
                  "sid": "8061",
                  "syscode": "30"
              }
            }
            cwx.request({
                url: '/restapi/soa2/12378/json/GetAppConfig',
                method: "POST",
                data: params,
                success: function (res) {
                  //setTimeout(function(){
                    config.isRefreshNow = false;
                    var newStore = {};
                    if(res.data && res.data.configList && res.data.configList){
                        res.data.configList.forEach(function(item){
                            try{
                                newStore[item.configCategory] = JSON.parse(item.configContent)
                            }catch(e){
                                newStore[item.configCategory] = item.configContent
                            }
                        })
                        config.lastModified = +(new Date());
                        
                        
                        callback && callback(JSON.parse(JSON.stringify(newStore)));
  
                        for(var k in newStore){
                            try{
                                var oldVal = config.store[k] ? JSON.stringify(config.store[k]) : "";
                                var newVal = newStore[k] ? JSON.stringify(newStore[k]) :"";
                                
                                
                                if(oldVal != newVal){
                                    config.watchDirty[k] = JSON.parse(JSON.stringify(newStore[k]))
                                    if(k in config.watchFn){
                                        config.watchFn[k] && config.watchFn[k](config.watchDirty[k]);
                                        delete config.watchDirty[k];
                                    }
                                }
                            }catch(e){
                                //
                            }finally{
                                config.store[k] = newStore[k];
                            }
                        }
                    }
                  //}, 2000)
                    
                },
                fail: function(res){
                    config.isRefreshNow = false;
                    config.logError('wxapp_getConfigFail', '')
                }
            })
        }
        
    },
    logError: function(type, msg){
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
    },
    get: function(key, callback){
        if(config.keys.indexOf(key)>-1){
            //
        }else{
            config.keys.push(key);
        }
        config.refreshStore(function(data){
            callback(data[key])
        });
    },
    watch: function(key, callback){
        //console.error(2222)
        config.watchFn[key] = callback;
        if(key in config.watchDirty){
          callback && callback(config.watchDirty[key]);
          delete config.watchDirty[key];
        }else if(key in config.store){
          callback && callback(config.store[key]);
        }
        config.refreshStore();
        
    }

    
}
config.run = function(){
  config.refreshStore();
  if(config.timer){
    clearInterval(config.timer);
  }
  config.timer = setInterval(function(){
      //console.error('compare config');
      config.refreshStore();
  }, 60000)
}

module.exports = config;