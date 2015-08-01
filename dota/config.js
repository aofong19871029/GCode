define(['libs'], function(){
    var baseDir = Ancients.dir || '';

    require.config({
        baseUrl: baseDir,
        waitSeconds: 20,
        paths: {
            'libs': 'external/libs',
            'dApp': 'app/d.abstract.app',
            'dInherit': 'common/d.class',
            //'dAjax': 'common/d.ajax',
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
            'dHash': 'util/d.util.hash',
            'dUIView': 'ui/d.ui.view',
            'dUrl': 'util/d.util.url',
            'dPageCache': 'page/d.page.cache',
            'dGuid': 'util/d.util.guid'
        }
    });
});