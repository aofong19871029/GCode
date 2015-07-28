define(['libs'], function(){
    var baseDir = Ancients.dir;

    require.config({
        waitSeconds: 20,
        paths: {
            'libs': baseDir + 'external/libs',
            'dInherit': baseDir + 'common/d.class',
            'dValidate': baseDir + 'util/d.validate',
            'dDate': baseDir + 'util/d.date',
            'dAbstractStorage': baseDir + 'storage/d.abstract.storage'
        }
    });
});