define(['dStore', 'dCookie'], function(dStore, dCookie){
   var S = {};

    S.paramStore = new dStore({
        key: 'penaQuery',
        expir: '30I'
    });

    S.baiduCookie = new dCookie({
        key: 'BAIDUID',
        expir: '30I'
    });

    S.baiduCookie.set('BAIDUID', '956DE6BB9EDC1E0ECA9F2B2F585E1112:FG=1', 30, '/');

    return S;
});