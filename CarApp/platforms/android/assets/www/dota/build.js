({
    appDir: './',   //项目根目录
    dir: '../CarApp/www/dota/',  //输出目录，全部文件打包后要放入的文件夹（如果没有会自动新建的）

    baseUrl: './',   //相对于appDir，代表要查找js文件的起始文件夹，下文所有文件路径的定义都是基于这个baseUrl的

    modules: [					  //要优化的模块
        { name:'config'}//说白了就是各页面的入口文件，相对baseUrl的路径，也是省略后缀“.js”
    ],

    fileExclusionRegExp: /^(r|build)\.js|.gitignore|.idea|readme|web.config|.*\.scss$/,	//过滤，匹配到的文件将不会被输出到输出目录去

    optimizeCss: 'standard',

    removeCombined: true,   //如果为true，将从输出目录中删除已合并的文件

    paths: {	//相对baseUrl的路径
        '$': 'external/zepto',
        '_': 'external/underscore',
        'B': 'external/backbone.custom',
        'F': 'external/fastclick',
        'text': 'external/require.text',
        'css': 'external/require.css',
        'stickit': 'external/backbone.stickit',


        'libs': 'external/libs',
        'dApp': 'app/d.abstract.app',
        'dInherit': 'common/d.class',
        'dAjax': 'common/d.ajax',
        'dValidate': 'util/d.util.validate',
        'dDate': 'util/d.util.date',
        'dAbstractStorage': 'storage/d.abstract.storage',
        'dCookie': 'storage/d.cookie',
        'dLocalStorage': 'storage/d.local.storage',
        'dSessionStorage': 'storage/d.session.storage',
        'dStore': 'storage/d.store',
        'dBaseLog': 'log/d.base.log',
        'dConsoleAdapter': 'log/d.log.console',
        'dUIAdapter': 'log/d.log.ui',
        'dLog': 'log/d.log',
        'dHash': 'storage/d.hash',
        'dUrl': 'util/d.util.url',
        'dCryptMd5': 'util/crypt/d.crypt.md5',
        'dPageCache': 'page/d.page.cache',
        'dGuid': 'util/d.util.guid',
        'dAbstractApp': 'app/d.abstract.app',
        'dController': 'page/d.controller',
        'dModel': 'page/d.model',
        'dView': 'page/d.view',
        'dUIView': 'ui/d.ui.view',

        'dBaseUI': 'ui/d.ui.base',
        'dUIHeader': 'ui/d.ui.header',
        'dUIToast': 'ui/d.ui.toast',

        'dBridge': 'hybrid/d.bridge'
    },

    shim: {
        $: {
            exports: '$'
        },
        _: {
            exports: '_'
        },
        B: {
            deps: [
                '_',
                '$'
            ],
            exports: 'Backbone'
        },
        F: {
            exports: 'F'
        },
        stickit: {
            exports: 'F'
        }
    }
})