define(['dStore'], function(dStore){
    var S = {};

    S.reservationStore = new dStore({
        key: 'reservation',
        expir: '7D'
    });

    S.roleStore = new dStore({
        key: 'carrole',
        expir: '7D'
    });

    return S;
});