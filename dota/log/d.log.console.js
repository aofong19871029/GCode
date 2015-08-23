define(['dInherit', 'dBaseLog', 'dDate'], function(dInherit, dBaseLog, dDate){
    /**
     * 控制台console
     */
    var ConsoleAdapter = dInherit(dBaseLog.AbstractAdapter, {
        initialize: function(){
            this.__superInitialize.call(this);
        },
        /**
         * 输出log提示
         * @param entity
         */
        dispatch: function(entity){
            if(this.isOff() || window.console == undefined) return;

            var startTime = new dDate(entity.startTime).toString(),
                msg = '[' + entity.level.toUpperCase() + ']' + startTime + '     ' + entity.message;

            window.console[entity.level](msg);
        }
    });

    return ConsoleAdapter;
});