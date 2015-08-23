define(['dInherit', 'dBaseUI', 'dDate', 'dUIHeader', 'dUIView', 'dValidate'], function(dInherit, dBaseUI, dDate, dUIHeader, dUIView, dValidate) {
    var headerTpl =
            '<div class="ui-label-view">\
            <p class="ui-label-date">\
                <span class="fl">选择日期</span>\
                <span class="fr"><%=currentDay%></span>\
            </p>\
            </div>',
        monthTpl =
            '<div class="ui-calendar">\
                <table>\
                  <tbody class="ui-week">\
                     <tr>\
                     <td>日</td>\
                     <td>一</td>\
                     <td>二</td>\
                     <td>三</td>\
                     <td>四</td>\
                     <td>五</td>\
                     <td>六</td>\
                     </tr>\
                  </tbody>\
                  <caption>\
                     <span><%=m.year%></span> 年\
                     <span><%=m.month%></span> 月\
                  </caption>\
                  <tbody class="ui-calendar-tbody">\
                  <%_.each(m.data, function(day, i){%>\
                    <%if(i%7 === 0){%><tr><%}%>\
                    <td class="<%if(!day || day.invalid){%>ui-invalid<%}%><%if(day && day.tag){%> ui-tagtd<%}%>">\
                    <%if(day){%>\
                    <em><%=day.num%></em>\
                    <%if(day.tag){%><i><%=day.tag%></i><%}%>\
                    <%}%>\
                    </td>\
                    <%if(i !== 0 && (i+1)%7 === 0){%><tr><%}%>\
                  <%})%>\
                  </tbody>\
                </table>\
            </div>',
        calendarTpl =
            '<div class="ui-calendar-wrap">' +
                headerTpl +
                '<%_.each(months, function(m){%>' +
                monthTpl +
                '<%})%>' +
            '</div>';

    var Calendar = dInherit(dBaseUI, {
        __propertys__: function () {
            this.tplFunc = _.template(calendarTpl);

            this.monthCount = 4; // 3year

            this.root = $('body');

            this.callContainer = $('#main'); // view容器

            this.uiswitch = new dUIView();

            this.selectedDate;

            this.init = false;
        },

        events: {
            'click ui-calendar-tbody td'
        },

        setOpt: function(options) {
            options = options || {};

            this.setOptions($.extend(true, this.buildCalendarData(), {
                title: options.title || ''
            }));

            this.setHeader();
        },

        show: function(){
            if(!this.init) {
                this.root.append(this.$el);
                this.init = true;
            } else {
                this.$el.show();
            }


            this.uiswitch[this.animation ? 'slideLeft' : 'noAnimateSlide'](this.$el, this.callContainer);
        },

        setHeader: function(){
            var self = this;

            if(!this.header){
                this.header = new dUIHeader(this.$el);
            }

            this.header.setOpt($.extend(true, {
                back: true,
                listener: {
                    backHandler: function () {
                        self.uiswitch[this.animation ?'slideLeft' : 'noAnimateSlide'](self.callContainer, self.$el);
                        self.hide();
                        dValidate.isFunction(self.opt.getVal) && self.opt.getVal(self.selectedDate);
                    }
                },
                titleHtml: this.opt.title
            }, this.opt));
            this.header.show();
        },

        buildCalendarData: function(){
            var now = new dDate(),
                curYear = now.getYear(),
                curMonth = now.getMonth(),
                m = [];

            for(var i = 0; i < this.monthCount; i++){
                if(curMonth> 12) {
                    curMonth = 1;
                    curYear++;
                }

                m.push(this.getMonthData(curYear, curMonth));
                curMonth++;
            }

            return {
                months: m,
                currentDay: new dDate().toShortDateString()
            };
        },

        getMonthData: function(year, month){
            // 2015-11-1 有bug
            var firstDay = new dDate(year + '/' + month + '/1'),
                days = firstDay.getDaysOfMonth(),
                weekDayOfFirstDay = firstDay.getWeekDay(),
                months = [],
                row = [7, 1, 2, 3, 4, 5, 6],
                i = 0;

            while(i < row.length){
                if(weekDayOfFirstDay === row[i]){
                    break;
                }

                months.push(null);
                i++;
            }
            i = 0;

            while(i < days){
                i++;
                months.push({
                    num: i >= 10 ? i : '0' + i,
                    tag: !this._tagComplete && this.getTag(new dDate(year + '/' + month + '/' + i)),
                    invalid: !this._tagComplete && this.getTag(new dDate(year + '/' + month + '/' + i)) === 0
                });
            }

            return {
                data: months,
                year: year,
                month: month
            };
        },

        getTag: function(date){
            if(this._tagComplete) return;

            var now = new dDate(),
                todayShortDateString = now.toShortDateString(),
                dateShortDateString = date.toShortDateString(),
                tag;

            switch (true){
                case todayShortDateString > dateShortDateString:
                    tag = 0;
                    break;
                case todayShortDateString === dateShortDateString:
                    tag = '今天';
                    break;
                case now.addDay(1).toShortDateString() === dateShortDateString:
                    tag = '明天';
                    break;
                case now.addDay(2).toShortDateString() === dateShortDateString:
                    tag = '后天';
                    break;
                case now.addDay(2).toShortDateString() < dateShortDateString:
                    this._tagComplete = true;
                    break;
            }

            return tag;
        }

    });

    return Calendar;
});