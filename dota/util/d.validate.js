define(function(undefined){
    var validate = {
        isNull: function(data){
            return typeof data === 'undefined' || data == undefined;
        }
    };

    ['Function', 'String', 'Object', 'Array', 'Number'].each(function (item) {
        validate['is' + item] = function (data) {
            return $.type(data) === item.toLowerCase();
        }
    });

    return validate;
});