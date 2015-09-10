/**
 * 生成唯一的GUID
 * 与subview的viewname 组合作为subview $el的id
 * 也可以作为UI组件的唯一编号
 */

define(function () {
    return {
        newGuid: function(){
            var guid = "";
            for (var i = 1; i <= 32; i++){
                var n = Math.floor(Math.random()*16.0).toString(16);
                guid +=   n;
//                if((i==8)||(i==12)||(i==16)||(i==20))
//                    guid += "-";
            }
            return guid;
        }
    };
});