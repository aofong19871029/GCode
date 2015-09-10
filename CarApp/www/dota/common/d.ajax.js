// 暂时废弃，用Backbone.ajax 替代
define(['dValidate', 'dStore', 'libs'], function(dValidate, dStore){
    var contentTypeMap = {
            'json': 'application/json',
            'jsonp': 'jsonp'
        },
        getContentType = function(contentType) {
            if (contentType) {
                contentType = contentTypeMap[contentType] ? contentTypeMap[contentType] : contentType;
            }

            return contentType || contentTypeMap['json'];
        },
        globalAjaxSetting = {
            timeout: 20000,
            global: true, // 开启全局ajax事件做框架级处理 http://www.cnblogs.com/Johnny_Z/archive/2012/06/17/2552612.html
            accepts: contentTypeMap.json
        },
        globalAjaxEvent = {
            ajaxStart: function(){},
            ajaxSend: function(){},
            ajaxSuccess: function(){},
            ajaxError: function(){},
            ajaxComplete: function(){},
            ajaxStop: function(){}
        };

    // 全局ajax
//    $.extend($.ajaxSettings, globalAjaxSetting);

//    $(document.body)
//        .ajaxStart(globalAjaxEvent.ajaxStart)
//        .ajaxSend(globalAjaxEvent.ajaxSend)
//        .ajaxSuccess(globalAjaxEvent.ajaxSuccess)
//        .ajaxError(globalAjaxEvent.ajaxError)
//        .ajaxComplete(globalAjaxEvent.ajaxComplete)
//        .ajaxStop(globalAjaxEvent.ajaxStop);

    /**
     * 发送ajax请求
     * @param opt
     * @private
     */
    function sendReq(opt){
        if(!opt.url.startsWith('http://') && !opt.url.startsWith('https://')){
            opt.url = Ancients.serviceDir + opt.url;
        }

        var config = {
            url: opt.url,
            type: getContentType(opt.type),
            dataType: opt.dataType,
            data: opt.data,
            contentType: opt.contentType,
            timeout: opt.timeout || globalAjaxSetting.timeout,

            //+…2014-08-19
            // 获取响应的字节长度（responseText.length 系字符数）
            beforeSend: function (xhr) {
                if ($.type(opt.beforeSend) === 'function') {
                    opt.beforeSend(xhr);
                }
            },

            //-1…2014-08-19
            // success: function (res) {
            //+1…2014-08-19
            success: function (data, status, xhr) {
                if(opt.store instanceof  dStore){
                    opt.store.set(data);
                }

                if ($.type(opt.success) === 'function') {
                    opt.success(data);
                }
            },
            error: function (err) {
                if ($.type(opt.error) === 'function') {
                    opt.error(err);
                }
            }
        };

        $.ajax(config);
    }

    return {
        get: function(url, data, success, error, store){
            var opt = {
                url: url,
                success: dValidate.isFunction(success) ? success : function(){},
                error: dValidate.isFunction(error) ? error : function(){},
                dataType: contentTypeMap.json,
                type: 'GET',
                store: store,
                data: data
            };

            return sendReq(opt);
        },
        post: function(url, data, success, error, store){
            var opt = {
                url: url,
                success: dValidate.isFunction(success) ? success : function(){},
                error: dValidate.isFunction(error) ? error : function(){},
                dataType: contentTypeMap.json,
                type: 'POST',
                store: store,
                data: data
            };

            return sendReq(opt);
        },
        jsonp: function(url, data, success, error, store){
            var opt = {
                url: url,
                success: dValidate.isFunction(success) ? success : function(){},
                error: dValidate.isFunction(error) ? error : function(){},
                dataType: contentTypeMap.jsonp,
                type: 'GET',
                jsonpCallback: 'zeptoJsonp',
                store: store,
                data: data
            };

            return sendReq(opt);
        }
    };
});