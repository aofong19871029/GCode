define(['dInherit', 'dLocalStorage'], function(dInherit, dLocalStorage){
    var Store = dInherit({
        __propertys__: function(){
            // store key
            this.key = '';

            // timeout
            this.timeout = '7D';
        }
    });
});