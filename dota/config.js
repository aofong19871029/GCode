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
            'dValidate': getAbsolutePath('util/d.validate'),
            'dDate': getAbsolutePath('util/d.date'),
            'dAbstractStorage': getAbsolutePath('storage/d.abstract.storage'),
            'dCookie': getAbsolutePath('storage/d.cookie'),
            'dLocalStorage': getAbsolutePath('storage/d.local.storage'),
            'dSessionStorage': getAbsolutePath('storage/d.session.storage')
        }
    });
});