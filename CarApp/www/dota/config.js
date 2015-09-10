(function() {
    var baseDir = Ancients.frameworkDir || '',
        relativeCss = function(relative){
            alert('css!' + baseDir + relative + '.css')
            return 'css!' + baseDir + relative + '.css';
        };

    require.config({
        baseUrl: Ancients.dir,
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
            },
            dCordova: {
                exports: 'cordova'
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
            'dUrl': baseDir + 'util/d.util.url',
            'dCryptMd5': baseDir + 'util/crypt/d.crypt.md5',
            'dPageCache': baseDir + 'page/d.page.cache',
            'dGuid': baseDir + 'util/d.util.guid',
            'dCompare': baseDir + 'util/d.util.compare',
            'dAbstractApp': baseDir + 'app/d.abstract.app',
            'dController': baseDir + 'page/d.controller',
            'dModel': baseDir + 'page/d.model',
            'dView': baseDir + 'page/d.view',
            'dUIView': baseDir + 'ui/d.ui.view',

            'dBaseUI': baseDir + 'ui/d.ui.base',
            'dUIHeader': baseDir + 'ui/d.ui.header',
            'dUIToast': baseDir + 'ui/d.ui.toast',
            'dCalendar': baseDir + 'ui/d.ui.calendar',
            'dMask': baseDir + 'ui/d.ui.mask',
            'dLayer': baseDir + 'ui/d.ui.layer',
            'dPopLayer': baseDir + 'ui/d.ui.poplayer',

            'dBridge': baseDir + 'hybrid/d.bridge',
            // 基础框架
            '$': baseDir + 'external/zepto',
            '_': baseDir + 'external/underscore',
            'B': baseDir + 'external/backbone.custom',
            'F': baseDir + 'external/fastclick',
            'text': baseDir + 'external/require.text',
            'css': baseDir + 'external/require.css',
            'stickit': baseDir + 'external/backbone.stickit',
            'dCordova': 'cordova'
        }
    });

    alert('init');

    require(['dValidate'], function(){
        alert('dValidate');
    });

    //require(['dApp', 'dBridge', 'libs', 'dLog', 'dBridge', relativeCss('pure'), relativeCss('ancient')], function(dApp){
    //    var app = new dApp();
    //});
})();