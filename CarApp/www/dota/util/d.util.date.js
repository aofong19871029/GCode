define(['dInherit', 'libs'], function(dInherit){
    var dateFormatHelper = {
        reRaw: /((yy(yy)?|M(M(M(M)?)?)?|d(d)?|EEE(E)?|a|H(H)?|h(h)?|m(m)?|s(s)?|S))/g,
        reEsc: /{((yy(yy)?|M(M(M(M)?)?)?|d(d)?|EEE(E)?|a|H(H)?|h(h)?|m(m)?|s(s)?|S))}/g,
        monthNames: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        monthShortNames: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        dayNames: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        dayShortNames: [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
        ],
        ampm: ["AM", "PM"],
        patternValue: {
            yy: function () {
                return this.format.toFixedWidth(this.getFullYear(), 2);
            },
            yyyy: function () {
                return this.getFullYear().toString();
            },
            MMMM: function () {
                return this.format.monthNames[this.getMonth()];
            },
            MMM: function () {
                return this.format.monthShortNames[this.getMonth()];
            },
            MM: function () {
                return this.format.toFixedWidth(this.getMonth() + 1, 2);
            },
            M: function () {
                return this.getMonth() + 1;
            },
            dd: function () {
                return this.format.toFixedWidth(this.getDate(), 2);
            },
            d: function () {
                return this.getDate();
            },
            EEEE: function () {
                return this.format.dayNames[this.getDay()];
            },
            EEE: function () {
                return this.format.dayShortNames[this.getDay()];
            },
            HH: function () {
                return this.format.toFixedWidth(this.getHours(), 2);
            },
            H: function () {
                return this.getHours();
            },
            hh: function () {
                return this.format.toFixedWidth(this.getHours() % 12 || 12, 2);
            },
            h: function () {
                var hours = this.getHours() % 12;
                return (hours == 0) ? 12 : hours;
            },
            mm: function () {
                return this.format.toFixedWidth(this.getMinutes(), 2);
            },
            m: function () {
                return this.getMinutes();
            },
            ss: function () {
                return this.format.toFixedWidth(this.getSeconds(), 2);
            },
            s: function () {
                return this.getSeconds();
            },
            S: function () {
                return this.format.toFixedWidth(this.getMilliseconds(), 3);
            },
            a: function () {
                return this.format.ampm[this.getHours() < 12 ? 0 : 1];
            }
        },
        toFixedWidth: function (value, length, fill) {
            if (!fill) {
                fill = '0';
            }
            var result = value.toString();
            var padding = length - result.length;
            if (padding < 0) {
                result = result.substr(-padding);
            }
            else {
                for (var n = 0; n < padding; n++) {
                    result = fill + result;
                }
            }
            return result;
        }
    };

    var ClientDate = dInherit({
        initialize: function (date) {
            date = date || new Date();

            if(date instanceof  ClientDate){
                this.date = date.date;
            }
            else {
                this.date = new Date(date);
            }
        },
        /**
         * 格式化时间
         * @param pattern
         * @param escaped
         * @returns {string}
         */
        format: function(pattern, escaped){
            var result = '',
                startNdx = 0,
                regex = this.date.format[escaped ? "reEsc" : "reRaw"],
                match;

            if (pattern) {
                while ((match = regex.exec(pattern))) {
                    if (match.index > startNdx) {
                        result += pattern.substr(startNdx, match.index - startNdx);
                    }
                    result += dateFormatHelper.patternValue[match[1]].call(this.date);
                    startNdx = regex.lastIndex;
                }

                result += pattern.substr(startNdx);
            }

            return result;
        },
        /**
         * 当前时间加n天
         * @param n
         * @returns {ClientDate}
         */
        addDay: function (n) {
            n = n || 0;
            this.date.setDate(this.date.getDate() + n);
            return this;
        },
        /**
         * 当前天数加n月
         * @param n
         * @returns {ClientDate}
         */
        addMonth: function (n) {
            n = n || 0;
            this.date.setMonth(this.date.getMonth() + n);
            return this;
        },
        /**
         * 当前天数加n小时
         * @param n
         * @returns {ClientDate}
         */
        addHours: function (n) {
            n = n || 0;
            this.date.setHours(this.date.getHours() + n);
            return this;
        },
        /**
         * 当前天数加n分钟
         * @param n
         * @returns {ClientDate}
         */
        addMinutes: function (n) {
            n = n || 0;
            this.date.setMinutes(this.date.getMinutes() + n);
            return this;
        },
        getTime: function () {
            return this.date.valueOf();
        },
        getDate: function(){
            return this.date;
        },
        /**
         * 日期格式化输出为 yyyy-MM-dd hh:mm:ss
         * @returns {string}
         */
        toString: function(){
            return this.format('yyyy-MM-dd hh:mm:ss');
        }
    });

    $.extend(ClientDate, {
        /**
         * string 转dDate
         * @param str
         * @returns {ClientDate}
         */
        parse: function(str){
            var rShortDate = /^(\d{4})\-?(\d{1,2})\-?(\d{1,2})/i;;

            switch ($.type(str)){
                case 'string':
                    str = str || '';
                    if (str.match(rShortDate)) {
                        str = str.replace(regtime, "$2/$3/$1");
                    }
                    str = Date.parse(str);
                    str = new Date(str);
                    break;
                case 'number':
                    str = new Date(str);
                    break;
                default :
                    str = new Date();
                    break;
            }

            return new ClientDate(str);
        }
    });

    return ClientDate;
});