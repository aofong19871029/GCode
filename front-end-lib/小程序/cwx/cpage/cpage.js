var cwx = require('../ext/global.js').cwx;

var instanceId = 0;
/**
 * 框架通用封装的Page构造器,劫持生命周期，方便业绩统计以及this挂载更多api
 * @module CPage
 * @constructor
 * @param {*} options 
 */
var CPage = function (options) {
    if (CPage.__isComponent) {
        var copyOptions = cwx.util.copy(options);
        CPage.createInstance(copyOptions);
    } else {
        var pageData = {
            
            onPageScroll:function(){

            },
            onLoad: function () {
                var _this = this;
                var args = Array.prototype.slice.call(arguments, 0);

                var copyOptions = cwx.util.copy(options);
                var ins = CPage.createInstance(copyOptions);

                for (var k in ins) {
                    if (ins.hasOwnProperty(k)) {
                        if (k == 'data') {
                            this.data = ins[k];
                            this.setData(ins[k]);
                        } else if (
                            k == '__cpage' ||
                            k.indexOf('__') != 0 ||
                            copyOptions.hasOwnProperty(k)) {

                            _this[k] = ins[k];
                        }
                    }
                }

                var t = ins.__proto__;

                while (t && t != Object.prototype) {
                    Object.getOwnPropertyNames(t).forEach(function (k) {
                        if (k != 'constructor' && k != '__proto__') {
                            if (k.indexOf('__') != 0) {
                                if (cwx.util.type(t[k]) == 'function') {
                                    if (ins[k] === t[k]) {
                                        _this[k] = t[k].bind(ins);
                                    }
                                } else {
                                    _this[k] = t[k];
                                }
                            }
                        }
                    });

                    t = t.__proto__;
                }

                this.onLoad.apply(this, args);
                if (this.onShareAppMessage){
                }
            }
        }

        if (options.data) {
            pageData.data = cwx.util.copy(options.data);
            delete options.data;
        }
        //wrap onShareAppMessage
        if (options.onShareAppMessage) {
            try {
                var onShareAppMessage = options.onShareAppMessage;
                var wrapOnShareAppMessage = function (res) {
                    var shareData = onShareAppMessage.call(this,res);
                    //添加埋点
                    if (this.ubtTrace) {
                        var ubtData = cwx.util.copy(shareData);
                        this.ubtTrace('wxshare', ubtData)
                    }
                    var mkt = cwx.mkt.getShareUnion();
                    var path = shareData.path;
                    mkt = (path.indexOf('?') != -1 ? "&" : "?") + mkt;
                    shareData.path += mkt;

                    //wrap success 
                    var originSuccess = shareData.success;
                    shareData.success = function(res){
                    console.log('res = ',res);
                    if (res && res.shareTickets){
                      cwx.shareTicket = res.shareTickets[0]
                    }
                      if(originSuccess){
                        originSuccess.call(this,res);
                      }
                    }
                    return shareData;
                }
                pageData.onShareAppMessage = wrapOnShareAppMessage;
                delete options.onShareAppMessage
            } catch (e) {
                console.log('wrapOnShareAppMessage error');
            }
        }
        if(options.onPageScroll){
          pageData.onPageScroll = function(){}
        }
        for(var k in options){
//          if(k=='bindTextAreaBlur'){
//            console.error(typeof(options[k]))
//            console.error(pageData[k])
//          }
          
          if(typeof(options[k]=='function')){
            if(pageData[k]==undefined){
              pageData[k] = options[k]
            }
          }
        }
        Page(pageData);
    }

};

CPage.__isComponent = 0;
CPage.__cache = [];

CPage.createInstance = function (options) {
    var a = CPage.__isComponent;
    var ins = new CPage.baseClass(options);
    ins.__instanceId = instanceId++;

    var b = CPage.__isComponent;

    if (CPage.__isComponent) {
        CPage.__cache[CPage.__isComponent] = {
            id: ins.__instanceId,
            options: options,
            instance: ins
        };
    }

    return ins;
};


CPage.baseClass = require('./base.js');

CPage.modules = {
    'UBT': function () {
        return require('./ubt.js');
    },
    'Navigator': function () {
        return require('./navigator.js');
    }
};

CPage.use = function (subClass) {
    if (cwx.util.type(subClass) == 'string') {
        var fn = CPage.modules[subClass];
        if (cwx.util.type(fn) == 'function') {
            subClass = fn();
        } else {
            throw 'Unknow CPage module ' + subClass;
        }
    }
    if (cwx.util.type(subClass) == 'function') {
        CPage.baseClass = subClass;
    } else {
        throw 'CPage module only support class';
    }
};


module.exports = CPage;
