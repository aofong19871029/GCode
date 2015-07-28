define(['libs'], function(){
    var baseDir = Ancients.dir,
        libs = baseDir + 'external/zepto';

    require.config({
        waitSeconds: 20,
        paths: {
            'libs': baseDir + 'external/libs',
            'dInherit': baseDir + 'common/d.class'
        }
    });
});