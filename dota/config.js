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
            }
        },
        paths: {
            'libs': baseDir + 'external/libs',
            'dApp': baseDir + 'app/d.abstract.app',
            'dInherit': baseDir + 'common/d.class',
            //'dAjax': baseDir + 'common/d.ajax',
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
            // 基础框架
            '$': Ancients.dir + 'external/zepto',
            '_': Ancients.dir + 'external/underscore',
            'B': Ancients.dir + 'external/backbone.custom',
            'F': Ancients.dir + 'external/fastclick',
            'text': Ancients.dir + 'external/require.text',
            'css': Ancients.dir + 'external/require.css'
        }
    });

    require(['dApp', 'libs'], function(dApp){
        var app = new dApp();
    });
})();