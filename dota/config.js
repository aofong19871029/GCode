(function() {
    var baseDir = Ancients.dir || '';

    require.config({
        waitSeconds: 20,
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
        },
        paths: {
            'libs': baseDir + 'external/libs',
            'dApp': baseDir + 'app/d.abstract.app',
            'dInherit': baseDir + 'common/d.class',
            'dAjax': baseDir + 'common/d.ajax',
            'dValidate': baseDir + 'util/d.util.validate',
            'dDate': baseDir + 'util/d.util.date',
            'dAbstractStorage': baseDir + 'storage/d.abstract.storage',
            'dCookie': baseDir + 'storage/d.cookie',
            'dLocalStorage': baseDir + 'storage/d.local.storage',
            'dSessionStorage': baseDir + 'storage/d.session.storage',
            'dStore': baseDir + 'storage/d.store',
            'dBaseLog': baseDir + 'log/d.base.log',
            'dConsoleAdapter': baseDir + 'log/d.log.console',
            'dUIAdapter': baseDir + 'log/d.log.ui',
            'dLog': baseDir + 'log/d.log',
            'dHash': baseDir + 'storage/d.hash',
            'dUIView': baseDir + 'ui/d.ui.view',
            'dUrl': baseDir + 'util/d.util.url',
            'dPageCache': baseDir + 'page/d.page.cache',
            'dGuid': baseDir + 'util/d.util.guid',
            'dAbstractApp': baseDir + 'app/d.abstract.app',
            'dController': baseDir + 'page/d.controller',
            'dModel': baseDir + 'page/d.model',
            'dView': baseDir + 'page/d.view',
            'dUIView': baseDir + 'ui/d.ui.view',

            'dBaseUI': baseDir + 'ui/d.ui.base',
            'dUIHeader': baseDir + 'ui/d.ui.header',
            'dUIToast': baseDir + 'ui/d.ui.toast',
            // 基础框架
            '$': baseDir + 'external/zepto',
            '_': baseDir + 'external/underscore',
            'B': baseDir + 'external/backbone.custom',
            'F': baseDir + 'external/fastclick',
            'text': baseDir + 'external/require.text',
            'css': baseDir + 'external/require.css',
            'stickit': baseDir + 'external/backbone.stickit'
        }
    });

    require(['dApp', 'libs', 'stickit'], function(dApp){
        var app = new dApp();
    });
})();