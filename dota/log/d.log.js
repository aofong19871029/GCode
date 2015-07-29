/**
 * log 整合类
 */
define(['dBaseLog', 'dConsoleAdapter', 'dUIAdapter'], function(dBaseLog, dConsoleAdapter, dUIAdapter){
    dBaseLog.ConsoleAdapter = dConsoleAdapter;
    dBaseLog.UIAdapter = dUIAdapter;

    dBaseLog.defaultLog =  new dBaseLog.Logger('__FRAME_WORK__').addAdapter(new dBaseLog.ConsoleAdapter).addAdapter(new dBaseLog.UIAdapter);


    return dBaseLog;
});