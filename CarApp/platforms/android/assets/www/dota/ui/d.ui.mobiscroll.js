define(['dInherit', 'mobiscroll', Ancients.cssPath('dota/mobiscroll/mobiscroll.custom-2.17.0.min.css')], function(dInherit) {

    var DateTimeScroll = dInherit({
        __propertys__: function () {
            this.input;
        },

        initialize: function(input, options){
            options = options || {};

            input && (this.input = input);

            this.setOptions(options);
        },

        setOptions: function(options) {
            options = options || {};

            var type =  options.type || 'date';

            $(this.input).mobiscroll()[type]({
                theme: options.theme || 'ios',     // Specify theme like: theme: 'ios' or omit setting to use default
                mode: options.mode || 'mixed',       // Specify scroller mode like: mode: 'mixed' or omit setting to use default
                display: options.display || 'bottom', // Specify display mode like: display: 'bottom' or omit setting to use default
                lang: options.lang || 'zh',       // Specify language like: lang: 'pl' or omit setting to use default
                minDate: options.minDate || new Date(2000,3,10,9,22),  // More info about minDate: http://docs.mobiscroll.com/2-17-0/datetime#!opt-minDate
                maxDate: options.maxDate || new Date(2100, 12, 31, 0, 0),   // More info about maxDate: http://docs.mobiscroll.com/2-17-0/datetime#!opt-maxDate
                stepMinute: 5  // More info about stepMinute: http://docs.mobiscroll.com/2-17-0/datetime#!opt-stepMinute
            });
        }

    });

    return DateTimeScroll;
});