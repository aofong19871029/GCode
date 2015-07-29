define(['libs'], function(){
    var baseDir = Ancients.dir,
        getAbsolutePath = function(relative) {
            return baseDir + relative;
        };

    require.config({
        waitSeconds: 20,
        paths: {
            'libs': getAbsolutePath('external/libs'),
            'dInherit': getAbsolutePath('common/d.class'),
            'dAjax': getAbsolutePath('common/d.ajax'),
            'dValidate': getAbsolutePath('util/d.util.validate'),
            'dDate': getAbsolutePath('util/d.util.date'),
            'dAbstractStorage': getAbsolutePath('storage/d.abstract.storage'),
            'dCookie': getAbsolutePath('storage/d.cookie'),
            'dLocalStorage': getAbsolutePath('storage/d.local.storage'),
            'dSessionStorage': getAbsolutePath('storage/d.session.storage'),
            'dStore': getAbsolutePath('storage/d.store'),
            'dBaseLog': getAbsolutePath('log/d.base.log'),
            'dConsoleAdapter': getAbsolutePath('log/d.console.log'),
            'dUIAdapter': getAbsolutePath('log/d.ui.log'),
            'dLog': getAbsolutePath('log/d.log')
        }
    });
});