var env = 'prd';
try {
	var _env = wx.getStorageSync('globalEnvSetting');
	if (_env != null && _env.length) {
		env = _env;
	}
} catch (e) {

}
/**
 * 全局对象global文件，修改fat/uat环境改这里
 * @module global
 */
var __global = {
	/**
	 * @memberof module:global
	 */
	appId: 'wx0e6ed4f51db9d078',//独立小程序的APPID (必须修改)
	/**
	 * @memberof module:global
	 */
	accesscode:'XTHYY69RNSKLWEICHATMINI',//授权登录接入识别码
	/**
	 * @memberof module:global
	 */
	tabbar: ["pages/home/homepage", "pages/myctrip/list/list"], //每一个Tab的首页，用来判断页面层级，(按需修改)
	getIDsWhenLaunch: true, //启动的时候获取openid 和 unionid,为true时，启动会请求获取用户昵称授权，如果授权失败，则opened = '' union ='' (按需修改)
	/**
	 * @memberof module:global
	 */
	version: '1.1.72',
	cversion: '101.072',
	env: env, //'fat',//prd uat fat 网络环境 ， 发布前一定要设置为prd
	/**
	 * @memberof module:global
	 */
	host: 'm.ctrip.com', //默认都是用这个域名，建议不要修改 (禁止修改)
	/**
	 * @memberof module:global
	 */
	uat:'gateway.m.uat.qa.nt.ctripcorp.com',//uat域名
	/**
	 * @memberof module:global
	 */
	fat:'gateway.m.fws.qa.nt.ctripcorp.com',
};
Object.defineProperty(__global, "env",
	/**
	 * @name env
	 * @memberof module:global
	 */
	{
		get: function () {
			var _env = wx.getStorageSync('globalEnvSetting');
			if (_env != null && _env.length) {
				//
			} else {
				_env = 'prd'
			}
			return 'prd';//看这里。如果你要强制设置环境变量的话，直接修改这里
		}
	})
try {
	const accountInfo = wx.getAccountInfoSync()
	console.log(accountInfo.miniProgram.appId) // 小程序 appId
	console.log(accountInfo.plugin.appId) // 插件 appId
	console.log(accountInfo.plugin.version) // 插件版本号， 'a.b.c' 这样的形式
	__global.appId = accountInfo.miniProgram.appId;
} catch (e) {

}

module.exports = __global;
