
import { cwx, CPage } from '../cwx.js';
/**
 * @file component管理
 * @desc
 * <table><tr><td>可以直接使用cwx.componet['city']</td></tr></table>
 * @example 
 * {
    city: '/cwx/component/city/city',
    calendar: '/cwx/component/calendar/calendar',
    cwebview: '/cwx/component/cwebview/cwebview',
    shipforeignpassanger: '/pages/ship/foreignpassenger/index'
}
 */
var components = {
    city: '/cwx/component/city/city',
    calendar: '/cwx/component/calendar/calendar',
    cwebview: '/cwx/component/cwebview/cwebview',
    shipforeignpassanger: '/pages/ship/foreignpassenger/index',
    areas: '/cwx/component/country/country'
};

var component = {};
for( var name in components ) {
    ( function( name ) {
        component[ name ] = function(data, callback) {
            var opts = data;
            if (arguments.length > 1){
                opts = {
                    data: data,
                    callback: callback
                };
            }
            var currentPage = cwx.getCurrentPage();
            opts.url = components[ name ];
            if(opts && opts.data){
              opts.data.envIsMini = true; //小程序环境跳转  （false h5跳转）
              if (typeof opts.data.isNavigate === 'undefined') {
                opts.data.isNavigate = true;  //navigateTo方式
              }
            }

            // 如果有指定不使用 Navigate, 则调用redirectTo, 把当前页面从History中替换掉
            if (('cwebview' === name) && (opts.data.isNavigate === false)) {
                cwx.redirectTo({
                    url: opts.url + '?data=' + JSON.stringify(opts.data)
                })
                return;
            }

            currentPage.navigateTo(opts);
        };
    })( name );
}

module.exports = component;
