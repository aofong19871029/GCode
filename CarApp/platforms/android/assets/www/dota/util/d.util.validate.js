define(function(undefined){
    var validate = {
        isNull: function(data){
            return typeof data === 'undefined' || data == undefined;
        },
        isMobile: function(phone){
            return /^((\(\d{3}\))|(\d{3}\-))?1(3|4|5|7|8)\d{9}$/.test(phone.toString().trim());
        },
        isEmptyStr: function(val){
            return $.type(val) !== 'string' || !val.trim().length;
        },
        isValidPassword: function(password){
            return !this.isEmptyStr(password) && password.trim().length >= 6;
        },
        isEqual: function(a, b){
            return a === b || a == b;
        }
    };

    ['Function', 'String', 'Object', 'Array', 'Number'].forEach(function (item) {
        validate['is' + item] = function (data) {
            return $.type(data) === item.toLowerCase();
        }
    });

    return validate;
});