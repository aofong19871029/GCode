import { CPage } from '../ext/global.js';

var config = {
    hasInit: false,
    init: function(){
        if(!this.hasInit){
            CPage.use('Navigator');
            CPage.use('UBT');
            this.hasInit = true;
        }
        
    },
	ubtDebug: false
};

module.exports = config;
