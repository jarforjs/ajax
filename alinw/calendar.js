define("alinw/calendar/1.1.17/calendar-debug", [ "$-debug", "gallery/moment/2.8.1/moment-debug", "./base-calendar-debug", "arale/position/1.0.1/position-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "./i18n/zh-cn-debug", "./i18n/zh-tw-debug", "./i18n/fr-debug", "./i18n/ja-debug", "./i18n/en-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "./date-column-debug", "./base-column-debug", "./chinese-lunar-debug", "./month-column-debug", "./year-column-debug", "./time-column-debug", "alinw/tip/2.1.0/tip-debug", "arale/tip/1.2.2/tip-debug", "arale/popup/1.1.6/popup-debug", "arale/overlay/1.1.4/overlay-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.8.1/moment-debug");
    var BaseCalendar = require("./base-calendar-debug");
    var DateColumn = require("./date-column-debug");
    var MonthColumn = require("./month-column-debug");
    var YearColumn = require("./year-column-debug");
    var TimeColumn = require("./time-column-debug");
    // var template = [
    //     '<div class="ui-calendar">',
    //     '<div class="ui-calendar-pannel" data-role="pannel">',
    //     '<span class="ui-calendar-control" data-role="prev-year">&lt;&lt;</span>',
    //     '<span class="ui-calendar-control" data-role="prev-month">&lt;</span>',
    //     '<span class="ui-calendar-control month" data-role="current-month"></span>',
    //     '<span class="ui-calendar-control year" data-role="current-year"></span>',
    //     '<span class="ui-calendar-control" data-role="next-month">&gt;</span>',
    //     '<span class="ui-calendar-control" data-role="next-year">&gt;&gt;</span>',
    //     '</div>',
    //     '<div class="ui-calendar-container" data-role="container">',
    //     '</div>',
    //     '<div class="ui-calendar-time" data-role="time-container"></div>',
    //     '</div>'
    // ].join('');
    var Calendar = BaseCalendar.extend({
        attrs: {
            mode: "dates",
            template: template,
            model: {
                getter: function() {
                    return {
                        holidays: this.get("holidays"),
                        showHoliday: this.get("showHoliday"),
                        showLunar: this.get("showLunar")
                    };
                }
            }
        },
        events: {
            "click [data-role=current-month]": function(ev) {
                if (this.get("mode") === "months") {
                    this.renderContainer("dates");
                } else {
                    this.renderContainer("months");
                }
            },
            "click [data-role=current-year]": function(ev) {
                if (this.get("mode") === "years") {
                    this.renderContainer("dates");
                } else {
                    this.renderContainer("years");
                }
            },
            "click [data-role=prev-year]": function(ev) {
                var focus = this.years.prev();
                this.dates.select(focus);
                this.months.select(focus);
            },
            "click [data-role=next-year]": function(ev) {
                var focus = this.years.next();
                this.dates.select(focus);
                this.months.select(focus);
            },
            "click [data-role=prev-month]": function(ev) {
                var focus = this.months.prev();
                this.dates.select(focus);
                this.years.select(focus);
            },
            "click [data-role=next-month]": function(ev) {
                var focus = this.months.next();
                this.dates.select(focus);
                this.years.select(focus);
            }
        },
        setup: function() {
            Calendar.superclass.setup.call(this);
            this.renderPannel();
            // 清空按钮
            if (!!this.get("clearBtn") && $(this.get("clearBtn")).size() > 0) {
                var trigger = $(this.get("trigger"));
                $(this.get("clearBtn")).on("click", function() {
                    trigger.val("");
                });
            }
            var attrs = {
                lang: this.get("lang"),
                focus: this.get("focus"),
                range: this.get("range"),
                format: this.get("format"),
                startDay: this.get("startDay"),
                process: this.get("process"),
                holidays: this.get("holidays"),
                showLunar: this.get("showLunar"),
                showHoliday: this.get("showHoliday"),
                zIndex: this.get("zIndex")
            };
            this.dates = new DateColumn(attrs);
            this.months = new MonthColumn(attrs);
            this.years = new YearColumn(attrs);
            /*
             * 新增时间选择器容器
             */
            if (!!this.get("showTime")) {
                var timeParams = this.get("showTimeParams");
                var timeAttrs = $.extend({}, attrs, timeParams);
                this.times = new TimeColumn(timeAttrs);
            }
            var self = this;
            /*
             * showTime，则监听times
             */
            if (!!this.get("showTime")) {
                this.times.on("select", function(value, el) {
                    var focus = self.get("focus");
                    focus.hour(value[0]).minute(value[1]).second(value[2]);
                    self.trigger("selectTime", value);
                    if (moment.isMoment(focus)) {
                        focus = focus.format(self.get("format"));
                        self.set("focus", focus);
                    }
                    self.output(focus);
                });
            }
            this.dates.on("select", function(value, el) {
                //                self.set('focus', value);
                /*
                 * 考虑showTime的情况，需要保持时、分、秒
                 */
                if (moment.isMoment(value)) {
                    var year = value.year(), month = value.month(), day = value.date();
                    var focus = moment(self.get("focus"), self.get("format"));
                    focus.year(year).month(month).date(day);
                    self.set("focus", focus);
                }
                var focus = self.get("focus");
                self.months.select(focus);
                self.years.select(focus);
                if (el) {
                    self.trigger("selectDate", value);
                    /*
                     * M
                     * @ermin.zem
                     * 修改为self.output(focus)
                     */
                    if (moment.isMoment(focus)) {
                        focus = focus.format(this.get("format"));
                    }
                    /*
                     * M
                     * @ermin.zem
                     * 修改：只有当模式为非时间选择器的时候才自动ouput
                     * */
                    if (!self.get("showTime")) self.output(focus);
                }
            });
            this.months.on("select", function(value, el) {
                var focus = self.get("focus");
                focus.month(value);
                self.set("focus", focus);
                self.renderPannel();
                if (el) {
                    self.renderContainer("dates", focus);
                    self.trigger("selectMonth", focus);
                }
            });
            this.years.on("select", function(value, el) {
                var focus = self.get("focus");
                focus.year(value);
                self.set("focus", focus);
                self.renderPannel();
                if (el && el.data("role") === "year") {
                    self.renderContainer("dates", focus);
                    self.trigger("selectYear", focus);
                }
            });
            var container = this.element.find("[data-role=container]");
            container.append(this.dates.element);
            container.append(this.months.element);
            container.append(this.years.element);
            this.renderContainer("dates");
            /*
             * 添加时间选择器至 - .ui-calendar-time
             * */
            if (!!this.get("showTime")) {
                var cont = this.element.find("[data-role=time-container]");
                cont.append(this.times.element);
            }
            /*
             * 设置组件z-index
             */
            if (this.get("zIndex")) {
                this.element.css("zIndex", this.get("zIndex"));
            }
        },
        renderContainer: function(mode, focus) {
            this.set("mode", mode);
            focus = focus || this.get("focus");
            this.dates.hide();
            this.months.hide();
            this.years.hide();
            this.dates.select(focus, null);
            this.months.select(focus, null);
            this.years.select(focus, null);
            if (mode === "dates") {
                this.dates.element.show();
            } else if (mode === "months") {
                this.months.element.show();
            } else if (mode === "years") {
                this.years.element.show();
            }
            return this;
        },
        /* 渲染ui-calendar-pannel区块 */
        renderPannel: function() {
            var focus = this.get("focus");
            var monthPannel = this.element.find("[data-role=current-month]");
            var yearPannel = this.element.find("[data-role=current-year]");
            var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
            var month = MONTHS[focus.month()];
            month = this.get("lang")[month] || month;
            monthPannel.text(month);
            yearPannel.text(focus.year());
        },
        focus: function(date) {
            date = moment(date, this.get("format"));
            this.dates.focus(date);
            this.months.focus(date);
            this.years.focus(date);
            if (this.times) {
                this.times.focus(date);
            }
        },
        range: function(range) {
            // change range dynamically
            this.set("range", range);
            this.dates.set("range", range);
            this.months.set("range", range);
            this.years.set("range", range);
            this.renderContainer(this.get("mode"));
            //fix issue by zhouquan.yezq
            //http://gitlab.alibaba-inc.com/alinw/calendar/issues/9
            this.renderPannel();
        },
        show: function() {
            var value = this._outputTime();
            if (value) {
                this.dates.select(value);
                if (this.times) {
                    this.times.focus(value, true);
                }
            }
            Calendar.superclass.show.call(this);
        },
        destroy: function() {
            this.dates.destroy();
            this.months.destroy();
            this.years.destroy();
            if (this.times) {
                this.times.destroy();
            }
            Calendar.superclass.destroy.call(this);
        }
    });
    Calendar.BaseColumn = require("./base-column-debug");
    Calendar.BaseCalendar = BaseCalendar;
    Calendar.DateColumn = DateColumn;
    Calendar.MonthColumn = MonthColumn;
    Calendar.YearColumn = YearColumn;
    Calendar.TimeColumn = TimeColumn;
    module.exports = Calendar;
    function template(model, options) {
        var className = [];
        if (model.showLunar) {
            className.push("ui-calendar-lunar");
        }
        if (model.showHoliday && model.holidays) {
            className.push("ui-calendar-holiday");
        }
        var html = [ '<div class="ui-calendar ' + className.join(" ") + '">', '<div class="ui-calendar-pannel" data-role="pannel">', '<span class="ui-calendar-control" data-role="prev-year">&lt;&lt;</span>', '<span class="ui-calendar-control" data-role="prev-month">&lt;</span>', '<span class="ui-calendar-control month" data-role="current-month"></span>', '<span class="ui-calendar-control year" data-role="current-year"></span>', '<span class="ui-calendar-control" data-role="next-month">&gt;</span>', '<span class="ui-calendar-control" data-role="next-year">&gt;&gt;</span>', "</div>", '<div class="ui-calendar-container" data-role="container">', "</div>", '<div class="ui-calendar-time" data-role="time-container"></div>', "</div>" ].join("");
        return html;
    }
});

define("alinw/calendar/1.1.17/base-calendar-debug", [ "$-debug", "arale/position/1.0.1/position-debug", "gallery/moment/2.8.1/moment-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "alinw/calendar/1.1.17/i18n/zh-cn-debug", "alinw/calendar/1.1.17/i18n/zh-tw-debug", "alinw/calendar/1.1.17/i18n/fr-debug", "alinw/calendar/1.1.17/i18n/ja-debug", "alinw/calendar/1.1.17/i18n/en-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var Position = require("arale/position/1.0.1/position-debug");
    var moment = require("gallery/moment/2.8.1/moment-debug");
    var Widget = require("arale/widget/1.1.1/widget-debug");
    var Shim = require("arale/iframe-shim/1.0.2/iframe-shim-debug");
    // var lang = require('./i18n/zh-cn') || {};
    /*
     * M
     * @ermin.zem
     * 修复i18n问题
     */
    var langs = {
        "zh-cn": require("alinw/calendar/1.1.17/i18n/zh-cn-debug"),
        "zh-tw": require("alinw/calendar/1.1.17/i18n/zh-tw-debug"),
        fr: require("alinw/calendar/1.1.17/i18n/fr-debug"),
        ja: require("alinw/calendar/1.1.17/i18n/ja-debug"),
        en: require("alinw/calendar/1.1.17/i18n/en-debug")
    };
    var Templatable = require("arale/templatable/0.9.2/templatable-debug");
    var ua = (window.navigator.userAgent || "").toLowerCase();
    var match = ua.match(/msie\s+(\d+)/);
    var insaneIE = false;
    if (match && match[1]) {
        // IE < 9
        insaneIE = parseInt(match[1], 10) < 9;
    }
    if (document.documentMode && document.documentMode < 9) {
        insaneIE = true;
    }
    var BaseCalendar = Widget.extend({
        Implements: Templatable,
        attrs: {
            /*
             * M
             * @ermin.zem
             * 修复i18n问题
             */
            lang: "zh-cn",
            trigger: null,
            triggerType: "click",
            output: {
                value: "",
                getter: function(val) {
                    val = val ? val : this.get("trigger");
                    return $(val);
                }
            },
            hideOnSelect: true,
            focus: {
                value: "",
                getter: function(val) {
                    val = val || this._outputTime();
                    if (val) {
                        return moment(val, this.get("format"));
                    }
                    return this.getCurrentDate();
                },
                setter: function(val) {
                    if (!val) {
                        return this.getCurrentDate();
                    }
                    return moment(val, this.get("format"));
                }
            },
            /*
             * +
             * @ermin.zem
             * 新增属性：
             * showTime: 是否显示时间选择器
             */
            showTime: false,
            /*
             * +
             * @ermin.zem
             * showTimeParams
             *     showHour
             *     showMinute
             *     showSecond
             */
            showTimeParams: {
                showHour: true,
                showMinute: true,
                showSecond: true
            },
            //            format: 'YYYY-MM-DD',
            /*
             * M
             * @ermin.zem
             * showTime为true的情况为'YYYY-MM-DD HH:mm:ss'
             */
            format: {
                value: null,
                getter: function(val) {
                    var _showTimeParams = this.get("showTimeParams");
                    var format = "";
                    var timeFormat = [];
                    if (_showTimeParams.showHour) timeFormat.push("HH");
                    if (_showTimeParams.showMinute) timeFormat.push("mm");
                    if (_showTimeParams.showSecond) timeFormat.push("ss");
                    timeFormat = timeFormat.join(":");
                    var format = val ? val : this.get("showTime") ? "YYYY-MM-DD " + timeFormat : "YYYY-MM-DD";
                    return format;
                }
            },
            startDay: "Sun",
            range: {
                value: null,
                setter: function(val) {
                    if ($.isArray(val)) {
                        var format = this.get("format");
                        var range = [];
                        $.each(val, function(i, date) {
                            date = date === null ? null : moment(date, format);
                            range.push(date);
                        });
                        return range;
                    }
                    return val;
                }
            },
            /*
             * +
             * @ermin.zem
             * zIndex: 可配置z-index属性
             */
            zIndex: 99,
            process: null,
            align: {
                getter: function(val) {
                    if (val) return val;
                    var trigger = $(this.get("trigger"));
                    if (trigger) {
                        return {
                            selfXY: [ 0, 0 ],
                            baseElement: trigger,
                            baseXY: [ 0, "100%" ]
                        };
                    }
                    return {
                        selfXY: [ 0, 0 ],
                        baseXY: [ 0, 0 ]
                    };
                }
            },
            holidays: null,
            showLunar: false,
            showHoliday: false,
            /*
             * +
             * clearBtn: 清空按钮
             * */
            clearBtn: null
        },
        compileTemplate: function() {
            // the template is a runtime handlebars function
            var fn = this.get("template");
            if (!fn) {
                return "";
            }
            var model = this.get("model");
            var lang = this.get("lang") || {};
            return fn(model, {
                helpers: {
                    _: function(key) {
                        return lang[key] || key;
                    }
                }
            });
        },
        // parseElement: function() {
        //     // rewrite parseElement of widget
        //     this.element = $(this.compileTemplate());
        // },
        /*
        * @author: zhouquan.yezq
        * @time  :  9/26 2014
        * 获取当前时间, 修复双个日历，后面的日历停留在8月份的问题
        */
        getCurrentDate: function() {
            var current_date = moment();
            //支持分秒
            current_date = moment([ current_date.year(), current_date.month(), current_date.date(), current_date.hour(), current_date.minute(), current_date.second() ]);
            return current_date;
        },
        setup: function() {
            BaseCalendar.superclass.setup.call(this);
            this.enable();
            /*
             * +
             * @ermin.zem
             * 修复i18n问题
             */
            if (typeof this.get("lang") === "string") {
                this.set("lang", langs[this.get("lang")]);
            }
            this._shim = new Shim(this.element).sync();
            var self = this;
            /*
             * +
             * @ermin.zem
             * 如果不是showTime，才让焦点始终处于trigger中
             */
            if (!this.get("showTime")) {
                // keep cursor focus in trigger
                this.element.on("mousedown", function(e) {
                    if (insaneIE) {
                        var trigger = $(self.get("trigger"))[0];
                        trigger.onbeforedeactivate = function() {
                            window.event.returnValue = false;
                            trigger.onbeforedeactivate = null;
                        };
                    }
                    e.preventDefault();
                });
            }
        },
        show: function() {
            this.trigger("show");
            if (!this.rendered) {
                this._pin();
                this.render();
            }
            this._pin();
            this.element.show();
        },
        hide: function() {
            this.trigger("hide");
            this.element.hide();
        },
        _pin: function(align) {
            align = align || this.get("align");
            Position.pin({
                element: this.element,
                x: align.selfXY[0],
                y: align.selfXY[1]
            }, {
                element: align.baseElement,
                x: align.baseXY[0],
                y: align.baseXY[1]
            });
        },
        _outputTime: function() {
            // parse time from output value
            var output = $(this.get("output"));
            var value = output.val() || output.text();
            if (value) {
                value = moment(value, this.get("format"));
                if (value.isValid()) {
                    return value;
                }
            }
        },
        output: function(value) {
            // send value to output
            var output = this.get("output");
            if (!output.length) {
                return;
            }
            value = value || this.get("focus");
            var tagName = output[0].tagName.toLowerCase();
            if (tagName === "input" || tagName === "textarea") {
                output.val(value);
            } else {
                output.text(value);
            }
            if (this.get("hideOnSelect")) {
                this.hide();
            }
        },
        enable: function() {
            // enable trigger for show calendar
            var _showTime = !!this.get("showTime");
            var trigger = this.get("trigger");
            if (!trigger) {
                return;
            }
            var self = this;
            var $trigger = $(trigger);
            if ($trigger.attr("type") === "date") {
                try {
                    // remove default style for type date
                    $trigger.attr("type", "text");
                } catch (e) {}
            }
            var event = this.get("triggerType") + ".calendar";
            $trigger.on(event, function() {
                self.show();
            });
            /*
             * +
             * @ermin.zem
             * 如果是showTime，则取消blur事件
             */
            if (!_showTime) {
                $trigger.on("blur.calendar", function() {
                    self.hide();
                });
            }
            /*
             * M
             * @ermin.zem
             * 如果是showTime，则自动隐藏
             */
            // enable auto hide feature
            if (_showTime) {
                self.autohide();
            } else {
                if ($trigger[0].tagName.toLowerCase() !== "input") {
                    self.autohide();
                }
            }
        },
        disable: function() {
            // disable trigger
            var trigger = this.get("trigger");
            var self = this;
            if (trigger) {
                var $trigger = $(trigger);
                var event = this.get("triggerType") + ".calendar";
                $trigger.off(event);
                $trigger.off("blur.calendar");
            }
        },
        autohide: function() {
            // autohide when trigger is not input
            var me = this;
            var trigger = $(this.get("trigger"))[0];
            var element = this.element;
            // click anywhere except calendar and trigger
            $("body").on("mousedown.calendar", function(e) {
                // not click on element
                if (element.find(e.target).length || element[0] === e.target) {
                    return;
                }
                /*
                 * +
                 * @ermin.zem
                 * 是否点击到了time-talbe(选择时间的tip) td上
                 */
                if ($(".ui-poptip-container").find(e.target).length) return;
                // not click on trigger
                if (trigger !== e.target) {
                    me.hide();
                }
            });
        },
        destroy: function() {
            if (this._shim) {
                this._shim.destroy();
            }
            // clean event binding of autohide
            $("body").off("mousedown.calendar");
            BaseCalendar.superclass.destroy.call(this);
        }
    });
    module.exports = BaseCalendar;
});

define("alinw/calendar/1.1.17/i18n/zh-cn-debug", [], {
    Su: "日",
    Mo: "一",
    Tu: "二",
    We: "三",
    Th: "四",
    Fr: "五",
    Sa: "六",
    Jan: "一月",
    Feb: "二月",
    Mar: "三月",
    Apr: "四月",
    May: "五月",
    Jun: "六月",
    Jul: "七月",
    Aug: "八月",
    Sep: "九月",
    Oct: "十月",
    Nov: "十一月",
    Dec: "十二月",
    OK: "确定"
});

define("alinw/calendar/1.1.17/i18n/zh-tw-debug", [], {
    Su: "日",
    Mo: "一",
    Tu: "二",
    We: "三",
    Th: "四",
    Fr: "五",
    Sa: "六",
    Jan: "一月",
    Feb: "二月",
    Mar: "三月",
    Apr: "四月",
    May: "五月",
    Jun: "六月",
    Jul: "七月",
    Aug: "八月",
    Sep: "九月",
    Oct: "十月",
    Nov: "十一月",
    Dec: "十二月",
    OK: "確定"
});

define("alinw/calendar/1.1.17/i18n/fr-debug", [], {
    Su: "Di",
    Mo: "Lu",
    Tu: "Ma",
    We: "Me",
    Th: "Je",
    Fr: "Ve",
    Sa: "Sa",
    Jan: "janv.",
    Feb: "févr.",
    Mar: "mars",
    Apr: "avr.",
    May: "mai",
    Jun: "juin",
    Jul: "juil.",
    Aug: "août",
    Sep: "sept.",
    Oct: "oct.",
    Nov: "nov.",
    Dec: "déc.",
    OK: "Ok"
});

define("alinw/calendar/1.1.17/i18n/ja-debug", [], {
    Su: "日",
    Mo: "月",
    Tu: "火",
    We: "水",
    Th: "木",
    Fr: "金",
    Sa: "土",
    Jan: "1月",
    Feb: "2月",
    Mar: "3月",
    Apr: "4月",
    May: "5月",
    Jun: "6月",
    Jul: "7月",
    Aug: "8月",
    Sep: "9月",
    Oct: "10月",
    Nov: "11月",
    Dec: "12月",
    OK: "はい"
});

define("alinw/calendar/1.1.17/i18n/en-debug", [], {
    Su: "S",
    Mo: "M",
    Tu: "T",
    We: "W",
    Th: "T",
    Fr: "F",
    Sa: "S",
    Jan: "Jan",
    Feb: "Feb",
    Mar: "Mar",
    Apr: "Apr",
    May: "May",
    Jun: "Jun",
    Jul: "Jul",
    Aug: "Aug",
    Sep: "Sep",
    Oct: "Oct",
    Nov: "Nov",
    Dec: "Dec",
    OK: "OK"
});

define("alinw/calendar/1.1.17/date-column-debug", [ "$-debug", "gallery/moment/2.8.1/moment-debug", "alinw/calendar/1.1.17/base-column-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "alinw/calendar/1.1.17/chinese-lunar-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.8.1/moment-debug");
    var BaseColumn = require("alinw/calendar/1.1.17/base-column-debug");
    var Lunar = require("alinw/calendar/1.1.17/chinese-lunar-debug");
    var DateColumn = BaseColumn.extend({
        attrs: {
            startDay: "Sun",
            template: template,
            range: {
                value: null,
                setter: function(val) {
                    if ($.isArray(val)) {
                        var format = this.get("format");
                        var range = [];
                        $.each(val, function(i, date) {
                            date = date === null ? null : moment(date, format);
                            range.push(date);
                        });
                        return range;
                    }
                    return val;
                }
            },
            process: null,
            model: {
                getter: function() {
                    var date = createDateModel(this.get("focus"), this.get("startDay"), this.get("range"), this.get("process"), this.get("holidays"), this.get("showLunar"), this.get("showHoliday"));
                    var day = createDayModel(this.get("startDay"));
                    var year = this.get("focus").year();
                    return {
                        date: date,
                        day: day,
                        year: year
                    };
                }
            }
        },
        events: {
            "click [data-role=date]": function(ev) {
                var el = $(ev.currentTarget);
                var value = el.data("value");
                this.select(value, el);
            }
        },
        prev: function() {
            var prev = this.get("focus").format("YYYY-MM-DD");
            var focus = this.get("focus").add("days", -1);
            return this._sync(focus, prev);
        },
        next: function() {
            var prev = this.get("focus").format("YYYY-MM-DD");
            var focus = this.get("focus").add("days", 1);
            return this._sync(focus, prev);
        },
        select: function(value, el) {
            if (el && el.hasClass("disabled-element")) {
                this.trigger("selectDisable", value, el);
                return value;
            }
            var prev = this.get("focus").format("YYYY-MM-DD");
            this.set("focus", value);
            return this._sync(this.get("focus"), prev, el);
        },
        focus: function(focus) {
            focus = focus || this.get("focus");
            var selector = "[data-value=" + focus.format("YYYY-MM-DD") + "]";
            this.element.find(".focused-element").removeClass("focused-element");
            this.element.find(selector).addClass("focused-element");
        },
        inRange: function(date) {
            if (!moment.isMoment(date)) {
                date = moment(date, this.get("format"));
            }
            return BaseColumn.isInRange(date, this.get("range"));
        },
        _sync: function(focus, prev, el) {
            this.set("focus", focus);
            if (focus.format("YYYY-MM") !== prev) {
                this.refresh();
            }
            this.focus(focus);
            // if user call select(value, null) it will not trigger an event
            if (el !== null) {
                this.trigger("select", focus, el);
            }
            return focus;
        }
    });
    module.exports = DateColumn;
    // helpers
    var DAYS = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ];
    function parseStartDay(startDay) {
        startDay = (startDay || 0).toString().toLowerCase();
        if ($.isNumeric(startDay)) {
            startDay = parseInt(startDay, 10);
            return startDay;
        }
        for (var i = 0; i < DAYS.length; i++) {
            if (DAYS[i].indexOf(startDay) === 0) {
                startDay = i;
                break;
            }
        }
        return startDay;
    }
    var DAY_LABELS = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ];
    function createDayModel(startDay) {
        // Translate startDay to number. 0 is Sunday, 6 is Saturday.
        startDay = parseStartDay(startDay);
        var items = [];
        for (var i = startDay; i < 7; i++) {
            items.push({
                label: DAY_LABELS[i],
                value: i
            });
        }
        for (i = 0; i < startDay; i++) {
            items.push({
                label: DAY_LABELS[i],
                value: i
            });
        }
        var current = {
            value: startDay,
            label: DAY_LABELS[startDay]
        };
        return {
            current: current,
            items: items
        };
    }
    function createDateModel(current, startDay, range, fn, holidays, showLunar, showHoliday) {
        var items = [], delta, d, daysInMonth;
        startDay = parseStartDay(startDay);
        var pushData = function(d, className) {
            /*
             * +
             * @ermin.zem
             * 由于为了支持showTime，current_date已经带上时、分、秒，导致BaseColumn.isInRange计算错误
             * 强行先将date转化为'YYYY-MM-DD'再进行计算
             */
            d = moment(d.format("YYYY-MM-DD"));
            var item = {
                value: d.format("YYYY-MM-DD"),
                label: d.date(),
                day: d.day(),
                className: className,
                available: BaseColumn.isInRange(d, range),
                showLunar: showLunar,
                showHoliday: showHoliday
            };
            if (fn) {
                item.type = "date";
                item = fn(item);
            }
            items.push(item);
        };
        // reset to the first date of the month
        var currentMonth = current.clone().date(1);
        var previousMonth = currentMonth.clone().add("months", -1);
        var nextMonth = currentMonth.clone().add("months", 1);
        // Calculate days of previous month
        // that should be on current month's sheet
        delta = currentMonth.day() - startDay;
        if (delta < 0) delta += 7;
        if (delta != 0) {
            daysInMonth = previousMonth.daysInMonth();
            // *delta - 1**: we need decrease it first
            for (i = delta - 1; i >= 0; i--) {
                d = previousMonth.date(daysInMonth - i);
                pushData(d, "previous-month");
            }
        }
        daysInMonth = currentMonth.daysInMonth();
        for (i = 1; i <= daysInMonth; i++) {
            d = currentMonth.date(i);
            pushData(d, "current-month");
        }
        // Calculate days of next month
        // that should be on current month's sheet
        delta = 35 - items.length;
        if (delta != 0) {
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                d = nextMonth.date(i);
                pushData(d, "next-month");
            }
        }
        var list = [];
        for (var i = 0; i < items.length / 7; i++) {
            list.push(items.slice(i * 7, i * 7 + 7));
        }
        var _current = {
            value: current.format("YYYY-MM-DD"),
            label: current.date()
        };
        return {
            current: _current,
            items: list,
            holidays: holidays
        };
    }
    /* template in handlebars
     <table class="ui-calendar-date" data-role="date-column">
     <tr class="ui-calendar-day-column">
     {{#each day.items}}
     <th class="ui-calendar-day ui-calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{_ label}}</th>
     {{/each}}
     </tr>
     {{#each date.items}}
     <tr class="ui-calendar-date-column">
     {{#each this}}
     <td class="ui-calendar-day-{{day}} {{className}} {{#unless available}}disabled-element{{/unless}}" data-role="date" data-value="{{value}}">{{label}}</td>
     {{/each}}
     </tr>
     {{/each}}
     </table>
     */
    function template(model, options) {
        // keep the same API as handlebars
        var _ = options.helpers._;
        var html = '<table class="ui-calendar-date" data-role="date-column">';
        // day column
        html += '<tr class="ui-calendar-day-column">';
        $.each(model.day.items, function(i, item) {
            html += '<th class="ui-calendar-day ui-calendar-day-' + item.value + '" ';
            html += 'data-role="day" data-value="' + item.value + '">';
            html += _(item.label);
            html += "</th>";
        });
        html += "</tr>";
        var backgroundColors = [ "", "red", "blue", "grey" ];
        // date column
        $.each(model.date.items, function(i, items) {
            html += '<tr class="ui-calendar-date-column">';
            $.each(items, function(i, item) {
                var className = [ "ui-calendar-day-" + item.day, item.className || "" ];
                if (!item.available) {
                    className.push("disabled-element");
                }
                var label = [ item.label ];
                if (item.showLunar || item.showHoliday) {
                    var year = moment(item.value).format("YYYY");
                    var month = moment(item.value).format("M");
                    var day = moment(item.value).format("D");
                    var data = model.date.holidays && model.date.holidays[year] || {};
                    var info = data[month] && data[month][day] || [];
                    var holidayName = info[0] || "";
                    //调休状态码；0=>无调整，1=>假，2=>休，3=>班
                    var adjustCode = info[1] || 0;
                    var adjustText = info[2] || "";
                    label.unshift('<div class="pr"><span>');
                    label.push("</span>");
                    if (item.showLunar && !(item.showHoliday && holidayName)) {
                        if (year > 1900 && year < 2100) {
                            var lunar = Lunar.format(Lunar.solarToLunar(moment(item.value).toDate()), "D");
                            label.push('<span class="lunar">');
                            label.push(lunar);
                            label.push("</span>");
                        }
                    }
                    if (item.showHoliday) {
                        if (holidayName) {
                            label.push('<span class="lunar" title="');
                            label.push(holidayName);
                            label.push('">');
                            label.push(holidayName);
                            label.push("</span>");
                        }
                        var backgroundColor = backgroundColors[adjustCode];
                        if (adjustCode) {
                            label.push('<span class="adjust-text ');
                            label.push(backgroundColor);
                            label.push('">');
                            label.push(adjustText);
                            label.push("</span>");
                        }
                    }
                    label.push("</div>");
                }
                html += '<td class="' + className.join(" ") + '" data-role="date"';
                html += 'data-value="' + item.value + '">';
                html += label.join("") + "</td>";
            });
            html += "</tr>";
        });
        html += "</table>";
        return html;
    }
});

define("alinw/calendar/1.1.17/base-column-debug", [ "$-debug", "gallery/moment/2.8.1/moment-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.8.1/moment-debug");
    var Widget = require("arale/widget/1.1.1/widget-debug");
    var current_date = moment();
    //    current_date = moment([current_date.year(), current_date.month(), current_date.date()]);
    /*
     * 支持时、分、秒
     * */
    current_date = moment([ current_date.year(), current_date.month(), current_date.date(), current_date.hour(), current_date.minute(), current_date.second() ]);
    var BaseColumn = Widget.extend({
        attrs: {
            focus: {
                value: "",
                getter: function(val) {
                    if (val) {
                        return val;
                    }
                    return current_date;
                },
                setter: function(val) {
                    if (!val) {
                        return current_date;
                    }
                    if (moment.isMoment(val)) {
                        return val;
                    }
                    return moment(val, this.get("format"));
                }
            },
            template: null,
            //            format: 'YYYY-MM-DD',
            /*
             * M
             * @ermin.zem
             * showTime为true的情况为'YYYY-MM-DD HH:mm:ss'
             */
            format: {
                value: null,
                getter: function(val) {
                    var format = val ? val : this.get("showTime") ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
                    return format;
                }
            },
            range: {
                value: "",
                getter: function(val) {
                    if (!val) {
                        return null;
                    }
                    if ($.isArray(val)) {
                        var start = val[0];
                        if (start && start.length > 4) {
                            start = moment(start, this.get("format"));
                        }
                        var end = val[1];
                        if (end && end.length > 4) {
                            end = moment(end, this.get("format"));
                        }
                        return [ start, end ];
                    }
                    return val;
                }
            },
            lang: {}
        },
        compileTemplate: function() {
            // the template is a runtime handlebars function
            var fn = this.get("template");
            if (!fn) {
                return "";
            }
            var model = this.get("model");
            var self = this;
            var lang = this.get("lang") || {};
            return fn(model, {
                helpers: {
                    _: function(key) {
                        return lang[key] || key;
                    }
                }
            });
        },
        parseElement: function() {
            // rewrite parseElement of widget
            this.element = $(this.compileTemplate());
        },
        show: function() {
            this.render();
            this.focus();
        },
        hide: function() {
            this.element.hide();
        },
        refresh: function() {
            this.element.html($(this.compileTemplate()).html());
        }
    });
    module.exports = BaseColumn;
    BaseColumn.isInRange = function(date, range) {
        if (range == null) {
            return true;
        }
        if ($.isArray(range)) {
            var start = range[0];
            var end = range[1];
            var result = true;
            if (start) {
                result = result && date >= start;
            }
            if (end) {
                result = result && date <= end;
            }
            return result;
        }
        if ($.isFunction(range)) {
            return range(date);
        }
        return true;
    };
});

/**
 * 农历与阳历的转换，目前只能支持1900至2100的转换
 * User: conis<conis.yi@gmail.com>
 * Github: https://github.com/conis/chinese-lunar
 * Date: 1/29/13
 * Time: 9:58 上午
 *
 */
(function() {
    /*
     农历每一年，对应公历的数据
     此数据来源于互联网，原作者不详细，在此感谢
     MAPPING[0][0]：每年闰月的月份，0表示不闰
     MAPPING[0][1, 13]：表示每月初一对应的阳历时间，前两个字符表示月，后两个字符表示月
     */
    var MAPPING = [ [ 8, "0131", "0301", "0331", "0429", "0528", "0627", "0726", "0825", "0924", "1023", "1122", "1222", "1320" ], //1900
    [ 0, "0219", "0320", "0419", "0518", "0616", "0716", "0814", "0913", "1012", "1111", "1211", "1310" ], //1901
    [ 0, "0208", "0310", "0408", "0508", "0606", "0705", "0804", "0902", "1002", "1031", "1130", "1230" ], //1902
    [ 5, "0129", "0227", "0329", "0427", "0527", "0625", "0724", "0823", "0921", "1020", "1119", "1219", "1317" ], //1903
    [ 0, "0216", "0317", "0416", "0515", "0614", "0713", "0811", "0910", "1009", "1107", "1207", "1306" ], //1904
    [ 0, "0204", "0306", "0405", "0504", "0603", "0703", "0801", "0830", "0929", "1028", "1127", "1226" ], //1905
    [ 4, "0125", "0223", "0325", "0424", "0523", "0622", "0721", "0820", "0918", "1018", "1116", "1216", "1314" ], //1906
    [ 0, "0213", "0314", "0413", "0512", "0611", "0710", "0809", "0908", "1007", "1106", "1205", "1304" ], //1907
    [ 0, "0202", "0303", "0401", "0430", "0530", "0629", "0728", "0827", "0925", "1025", "1124", "1223" ], //1908
    [ 2, "0122", "0220", "0322", "0420", "0519", "0618", "0717", "0816", "0914", "1014", "1113", "1213", "1311" ], //1909
    [ 0, "0210", "0311", "0410", "0509", "0607", "0707", "0805", "0904", "1003", "1102", "1202", "1301" ], //1910
    [ 6, "0130", "0301", "0330", "0429", "0528", "0626", "0726", "0824", "0922", "1022", "1121", "1220", "1319" ], //1911
    [ 0, "0218", "0319", "0417", "0517", "0615", "0714", "0813", "0911", "1010", "1109", "1209", "1307" ], //1912
    [ 0, "0206", "0308", "0407", "0506", "0605", "0704", "0802", "0901", "0930", "1029", "1128", "1227" ], //1913
    [ 5, "0126", "0225", "0327", "0425", "0525", "0623", "0723", "0821", "0920", "1019", "1117", "1217", "1315" ], //1914
    [ 0, "0214", "0316", "0414", "0514", "0613", "0712", "0811", "0909", "1009", "1107", "1207", "1305" ], //1915
    [ 0, "0203", "0304", "0403", "0502", "0601", "0630", "0730", "0829", "0927", "1027", "1125", "1225" ], //1916
    [ 2, "0123", "0222", "0323", "0421", "0521", "0619", "0719", "0818", "0916", "1016", "1115", "1214", "1313" ], //1917
    [ 0, "0211", "0313", "0411", "0510", "0609", "0708", "0807", "0905", "1005", "1104", "1203", "1302" ], //1918
    [ 7, "0201", "0302", "0401", "0430", "0529", "0628", "0727", "0825", "0924", "1024", "1122", "1222", "1321" ], //1919
    [ 0, "0220", "0320", "0419", "0518", "0616", "0716", "0814", "0912", "1012", "1110", "1210", "1309" ], //1920
    [ 0, "0208", "0310", "0408", "0508", "0606", "0705", "0804", "0902", "1001", "1031", "1129", "1229" ], //1921
    [ 5, "0128", "0227", "0328", "0427", "0527", "0625", "0724", "0823", "0921", "1020", "1119", "1218", "1317" ], //1922
    [ 0, "0216", "0317", "0416", "0516", "0614", "0714", "0812", "0911", "1010", "1108", "1208", "1306" ], //1923
    [ 0, "0205", "0305", "0404", "0504", "0602", "0702", "0801", "0830", "0929", "1028", "1127", "1226" ], //1924
    [ 4, "0124", "0223", "0324", "0423", "0522", "0621", "0721", "0819", "0918", "1018", "1116", "1216", "1314" ], //1925
    [ 0, "0213", "0314", "0412", "0512", "0610", "0710", "0808", "0907", "1007", "1105", "1205", "1304" ], //1926
    [ 0, "0202", "0304", "0402", "0501", "0531", "0629", "0729", "0827", "0926", "1025", "1124", "1224" ], //1927
    [ 2, "0123", "0221", "0322", "0420", "0519", "0618", "0717", "0815", "0914", "1013", "1112", "1212", "1311" ], //1928
    [ 0, "0210", "0311", "0410", "0509", "0607", "0707", "0805", "0903", "1003", "1101", "1201", "1231" ], //1929
    [ 6, "0130", "0228", "0330", "0429", "0528", "0626", "0726", "0824", "0922", "1022", "1120", "1220", "1319" ], //1930
    [ 0, "0217", "0319", "0418", "0517", "0616", "0715", "0814", "0912", "1011", "1110", "1209", "1308" ], //1931
    [ 0, "0206", "0307", "0406", "0506", "0604", "0704", "0802", "0901", "0930", "1029", "1128", "1227" ], //1932
    [ 5, "0126", "0224", "0326", "0425", "0524", "0623", "0722", "0821", "0920", "1019", "1118", "1217", "1315" ], //1933
    [ 0, "0214", "0315", "0414", "0513", "0612", "0712", "0810", "0909", "1008", "1107", "1207", "1305" ], //1934
    [ 0, "0204", "0305", "0403", "0503", "0601", "0701", "0730", "0829", "0928", "1027", "1126", "1226" ], //1935
    [ 3, "0124", "0223", "0323", "0421", "0521", "0619", "0718", "0817", "0916", "1015", "1114", "1214", "1313" ], //1936
    [ 0, "0211", "0313", "0411", "0510", "0609", "0708", "0806", "0905", "1004", "1103", "1203", "1302" ], //1937
    [ 7, "0131", "0302", "0401", "0430", "0529", "0628", "0727", "0825", "0924", "1023", "1122", "1222", "1320" ], //1938
    [ 0, "0219", "0321", "0420", "0519", "0617", "0717", "0815", "0913", "1013", "1111", "1211", "1309" ], //1939
    [ 0, "0208", "0309", "0408", "0507", "0606", "0705", "0804", "0902", "1001", "1031", "1129", "1229" ], //1940
    [ 6, "0127", "0226", "0328", "0426", "0526", "0625", "0724", "0823", "0921", "1020", "1119", "1218", "1317" ], //1941
    [ 0, "0215", "0317", "0415", "0515", "0614", "0713", "0812", "0910", "1010", "1108", "1208", "1306" ], //1942
    [ 0, "0205", "0306", "0405", "0504", "0603", "0702", "0801", "0831", "0929", "1029", "1127", "1227" ], //1943
    [ 4, "0125", "0224", "0324", "0423", "0522", "0621", "0720", "0819", "0917", "1017", "1116", "1215", "1314" ], //1944
    [ 0, "0213", "0314", "0412", "0512", "0610", "0709", "0808", "0906", "1006", "1105", "1205", "1303" ], //1945
    [ 0, "0202", "0304", "0402", "0501", "0531", "0629", "0728", "0827", "0925", "1025", "1124", "1223" ], //1946
    [ 2, "0122", "0221", "0323", "0421", "0520", "0619", "0718", "0816", "0915", "1014", "1113", "1212", "1311" ], //1947
    [ 0, "0210", "0311", "0409", "0509", "0607", "0707", "0805", "0903", "1003", "1101", "1201", "1230" ], //1948
    [ 7, "0129", "0228", "0329", "0428", "0528", "0626", "0726", "0824", "0922", "1022", "1120", "1220", "1318" ], //1949
    [ 0, "0217", "0318", "0417", "0517", "0615", "0715", "0814", "0912", "1011", "1110", "1209", "1308" ], //1950
    [ 0, "0206", "0308", "0406", "0506", "0605", "0704", "0803", "0901", "1001", "1030", "1129", "1228" ], //1951
    [ 5, "0127", "0225", "0326", "0424", "0524", "0622", "0722", "0820", "0919", "1019", "1117", "1217", "1315" ], //1952
    [ 0, "0214", "0315", "0414", "0513", "0611", "0711", "0810", "0908", "1008", "1107", "1206", "1305" ], //1953
    [ 0, "0203", "0305", "0403", "0503", "0601", "0630", "0730", "0828", "0927", "1027", "1126", "1225" ], //1954
    [ 3, "0124", "0222", "0324", "0422", "0522", "0620", "0719", "0818", "0916", "1016", "1114", "1214", "1313" ], //1955
    [ 0, "0212", "0312", "0411", "0510", "0609", "0708", "0806", "0905", "1004", "1103", "1203", "1301" ], //1956
    [ 8, "0131", "0302", "0331", "0430", "0529", "0628", "0727", "0825", "0924", "1023", "1122", "1221", "1320" ], //1957
    [ 0, "0218", "0320", "0419", "0519", "0617", "0717", "0815", "0913", "1013", "1111", "1211", "1309" ], //1958
    [ 0, "0208", "0309", "0408", "0508", "0606", "0706", "0804", "0903", "1002", "1101", "1130", "1230" ], //1959
    [ 6, "0128", "0227", "0327", "0426", "0525", "0624", "0724", "0822", "0921", "1020", "1119", "1218", "1317" ], //1960
    [ 0, "0215", "0317", "0415", "0515", "0613", "0713", "0811", "0910", "1010", "1108", "1208", "1306" ], //1961
    [ 0, "0205", "0306", "0405", "0504", "0602", "0702", "0731", "0830", "0929", "1028", "1127", "1227" ], //1962
    [ 4, "0125", "0224", "0325", "0424", "0523", "0621", "0721", "0819", "0918", "1017", "1116", "1216", "1315" ], //1963
    [ 0, "0213", "0314", "0412", "0512", "0610", "0709", "0808", "0906", "1006", "1104", "1204", "1303" ], //1964
    [ 0, "0202", "0303", "0402", "0501", "0531", "0629", "0728", "0827", "0925", "1024", "1123", "1223" ], //1965
    [ 3, "0121", "0220", "0322", "0421", "0520", "0619", "0718", "0816", "0915", "1014", "1112", "1212", "1311" ], //1966
    [ 0, "0209", "0311", "0410", "0509", "0608", "0708", "0806", "0904", "1004", "1102", "1202", "1231" ], //1967
    [ 7, "0130", "0228", "0329", "0427", "0527", "0626", "0725", "0824", "0922", "1022", "1120", "1220", "1318" ], //1968
    [ 0, "0217", "0318", "0417", "0516", "0615", "0714", "0813", "0912", "1011", "1110", "1209", "1308" ], //1969
    [ 0, "0206", "0308", "0406", "0505", "0604", "0703", "0802", "0901", "0930", "1030", "1129", "1228" ], //1970
    [ 5, "0127", "0225", "0327", "0425", "0524", "0623", "0722", "0821", "0919", "1019", "1118", "1218", "1316" ], //1971
    [ 0, "0215", "0315", "0414", "0513", "0611", "0711", "0809", "0908", "1007", "1106", "1206", "1304" ], //1972
    [ 0, "0203", "0305", "0403", "0503", "0601", "0630", "0730", "0828", "0926", "1026", "1125", "1224" ], //1973
    [ 4, "0123", "0222", "0324", "0422", "0522", "0620", "0719", "0818", "0916", "1015", "1114", "1214", "1312" ], //1974
    [ 0, "0211", "0313", "0412", "0511", "0610", "0709", "0807", "0906", "1005", "1103", "1203", "1301" ], //1975
    [ 8, "0131", "0301", "0331", "0429", "0529", "0627", "0727", "0825", "0924", "1023", "1121", "1221", "1319" ], //1976
    [ 0, "0218", "0320", "0418", "0518", "0617", "0716", "0815", "0913", "1013", "1111", "1211", "1309" ], //1977
    [ 0, "0207", "0309", "0407", "0507", "0606", "0705", "0804", "0902", "1002", "1101", "1130", "1230" ], //1978
    [ 6, "0128", "0227", "0328", "0426", "0526", "0624", "0724", "0823", "0921", "1021", "1120", "1219", "1318" ], //1979
    [ 0, "0216", "0317", "0415", "0514", "0613", "0712", "0811", "0909", "1009", "1108", "1207", "1306" ], //1980
    [ 0, "0205", "0306", "0405", "0504", "0602", "0702", "0731", "0829", "0928", "1028", "1126", "1226" ], //1981
    [ 4, "0125", "0224", "0325", "0424", "0523", "0621", "0721", "0819", "0917", "1017", "1115", "1215", "1314" ], //1982
    [ 0, "0213", "0315", "0413", "0513", "0611", "0710", "0809", "0907", "1006", "1105", "1204", "1303" ], //1983
    [ 10, "0202", "0303", "0401", "0501", "0531", "0629", "0728", "0827", "0925", "1024", "1123", "1222", "1321" ], //1984
    [ 0, "0220", "0321", "0420", "0520", "0618", "0718", "0816", "0915", "1014", "1112", "1212", "1310" ], //1985
    [ 0, "0209", "0310", "0409", "0509", "0607", "0707", "0806", "0904", "1004", "1102", "1202", "1231" ], //1986
    [ 6, "0129", "0228", "0329", "0428", "0527", "0626", "0726", "0824", "0923", "1023", "1121", "1221", "1319" ], //1987
    [ 0, "0217", "0318", "0416", "0516", "0614", "0714", "0812", "0911", "1011", "1109", "1209", "1308" ], //1988
    [ 0, "0206", "0308", "0406", "0505", "0604", "0703", "0802", "0831", "0930", "1029", "1128", "1228" ], //1989
    [ 5, "0127", "0225", "0327", "0425", "0524", "0623", "0722", "0820", "0919", "1018", "1117", "1217", "1316" ], //1990
    [ 0, "0215", "0316", "0415", "0514", "0612", "0712", "0810", "0908", "1008", "1106", "1206", "1305" ], //1991
    [ 0, "0204", "0304", "0403", "0503", "0601", "0630", "0730", "0828", "0926", "1026", "1124", "1224" ], //1992
    [ 3, "0123", "0221", "0323", "0422", "0521", "0620", "0719", "0818", "0916", "1015", "1114", "1213", "1312" ], //1993
    [ 0, "0210", "0312", "0411", "0511", "0609", "0709", "0807", "0906", "1005", "1103", "1203", "1301" ], //1994
    [ 8, "0131", "0301", "0331", "0430", "0529", "0628", "0727", "0826", "0925", "1024", "1122", "1222", "1320" ], //1995
    [ 0, "0219", "0319", "0418", "0517", "0616", "0715", "0814", "0912", "1012", "1111", "1211", "1309" ], //1996
    [ 0, "0207", "0309", "0407", "0507", "0605", "0705", "0803", "0902", "1002", "1031", "1130", "1230" ], //1997
    [ 5, "0128", "0227", "0328", "0426", "0526", "0624", "0723", "0822", "0921", "1020", "1119", "1219", "1317" ], //1998
    [ 0, "0216", "0318", "0416", "0515", "0614", "0713", "0811", "0910", "1009", "1108", "1208", "1307" ], //1999
    [ 0, "0205", "0306", "0405", "0504", "0602", "0702", "0731", "0829", "0928", "1027", "1126", "1226" ], //2000
    [ 4, "0124", "0223", "0325", "0423", "0523", "0621", "0721", "0819", "0917", "1017", "1115", "1215", "1313" ], //2001
    [ 0, "0212", "0314", "0413", "0512", "0611", "0710", "0809", "0907", "1006", "1105", "1204", "1303" ], //2002
    [ 0, "0201", "0303", "0402", "0501", "0531", "0630", "0729", "0828", "0926", "1025", "1124", "1223" ], //2003
    [ 2, "0122", "0220", "0321", "0419", "0519", "0618", "0717", "0816", "0914", "1014", "1112", "1212", "1310" ], //2004
    [ 0, "0209", "0310", "0409", "0508", "0607", "0706", "0805", "0904", "1003", "1102", "1201", "1231" ], //2005
    [ 7, "0129", "0228", "0329", "0428", "0527", "0626", "0725", "0824", "0922", "1022", "1121", "1220", "1319" ], //2006
    [ 0, "0218", "0319", "0417", "0517", "0615", "0714", "0813", "0911", "1011", "1110", "1210", "1308" ], //2007
    [ 0, "0207", "0308", "0406", "0505", "0604", "0703", "0801", "0831", "0929", "1029", "1128", "1227" ], //2008
    [ 5, "0126", "0225", "0327", "0425", "0524", "0623", "0722", "0820", "0919", "1018", "1117", "1216", "1315" ], //2009
    [ 0, "0214", "0316", "0414", "0514", "0612", "0712", "0810", "0908", "1008", "1106", "1206", "1304" ], //2010
    [ 0, "0203", "0305", "0403", "0503", "0602", "0701", "0731", "0829", "0927", "1027", "1125", "1225" ], //2011
    [ 4, "0123", "0222", "0322", "0421", "0521", "0619", "0719", "0817", "0916", "1015", "1114", "1213", "1312" ], //2012
    [ 0, "0210", "0312", "0410", "0510", "0608", "0708", "0807", "0905", "1005", "1103", "1203", "1301" ], //2013
    [ 9, "0131", "0301", "0331", "0429", "0529", "0627", "0727", "0825", "0924", "1024", "1122", "1222", "1320" ], //2014
    [ 0, "0219", "0320", "0419", "0518", "0616", "0716", "0814", "0913", "1013", "1112", "1211", "1310" ], //2015
    [ 0, "0208", "0309", "0407", "0507", "0605", "0704", "0803", "0901", "1001", "1031", "1129", "1229" ], //2016
    [ 6, "0128", "0226", "0328", "0426", "0526", "0624", "0723", "0822", "0920", "1020", "1118", "1218", "1317" ], //2017
    [ 0, "0216", "0317", "0416", "0515", "0614", "0713", "0811", "0910", "1009", "1108", "1207", "1306" ], //2018
    [ 0, "0205", "0307", "0405", "0505", "0603", "0703", "0801", "0830", "0929", "1028", "1126", "1226" ], //2019
    [ 4, "0125", "0223", "0324", "0423", "0523", "0621", "0721", "0819", "0917", "1017", "1115", "1215", "1313" ], //2020
    [ 0, "0212", "0313", "0412", "0512", "0610", "0710", "0808", "0907", "1006", "1105", "1204", "1303" ], //2021
    [ 0, "0201", "0303", "0401", "0501", "0530", "0629", "0729", "0827", "0926", "1025", "1124", "1223" ], //2022
    [ 2, "0122", "0220", "0322", "0420", "0519", "0618", "0718", "0816", "0915", "1015", "1113", "1213", "1311" ], //2023
    [ 0, "0210", "0310", "0409", "0508", "0606", "0706", "0804", "0903", "1003", "1101", "1201", "1231" ], //2024
    [ 6, "0129", "0228", "0329", "0428", "0527", "0625", "0725", "0823", "0922", "1021", "1120", "1220", "1319" ], //2025
    [ 0, "0217", "0319", "0417", "0517", "0615", "0714", "0813", "0911", "1010", "1109", "1209", "1308" ], //2026
    [ 0, "0206", "0308", "0407", "0506", "0605", "0704", "0802", "0901", "0930", "1029", "1128", "1228" ], //2027
    [ 5, "0126", "0225", "0326", "0425", "0524", "0623", "0722", "0820", "0919", "1018", "1116", "1216", "1315" ], //2028
    [ 0, "0213", "0315", "0414", "0513", "0612", "0711", "0810", "0908", "1008", "1106", "1205", "1304" ], //2029
    [ 0, "0203", "0304", "0403", "0502", "0601", "0701", "0730", "0829", "0927", "1027", "1125", "1225" ], //2030
    [ 3, "0123", "0221", "0323", "0422", "0521", "0620", "0719", "0818", "0917", "1016", "1115", "1214", "1313" ], //2031
    [ 0, "0211", "0312", "0410", "0509", "0608", "0707", "0806", "0905", "1004", "1103", "1203", "1301" ], //2032
    [ 7, "0131", "0301", "0331", "0429", "0528", "0627", "0726", "0825", "0923", "1023", "1122", "1222", "1320" ], //2033
    [ 0, "0219", "0320", "0419", "0518", "0616", "0716", "0814", "0913", "1012", "1111", "1211", "1309" ], //2034
    [ 0, "0208", "0310", "0408", "0508", "0606", "0705", "0804", "0902", "1001", "1031", "1130", "1229" ], //2035
    [ 6, "0128", "0227", "0328", "0426", "0526", "0624", "0723", "0822", "0920", "1019", "1118", "1217", "1316" ], //2036
    [ 0, "0215", "0317", "0416", "0515", "0614", "0713", "0811", "0910", "1009", "1107", "1207", "1305" ], //2037
    [ 0, "0204", "0306", "0405", "0504", "0603", "0702", "0801", "0830", "0929", "1028", "1126", "1226" ], //2038
    [ 5, "0124", "0223", "0325", "0423", "0523", "0622", "0721", "0820", "0918", "1018", "1116", "1216", "1314" ], //2039
    [ 0, "0212", "0313", "0411", "0511", "0610", "0709", "0808", "0906", "1006", "1105", "1204", "1303" ], //2040
    [ 0, "0201", "0302", "0401", "0430", "0530", "0628", "0728", "0827", "0925", "1025", "1124", "1223" ], //2041
    [ 2, "0122", "0220", "0322", "0420", "0519", "0618", "0717", "0816", "0914", "1014", "1113", "1212", "1311" ], //2042
    [ 0, "0210", "0311", "0410", "0509", "0607", "0707", "0805", "0903", "1003", "1102", "1201", "1231" ], //2043
    [ 7, "0130", "0229", "0329", "0428", "0527", "0625", "0725", "0823", "0921", "1021", "1119", "1219", "1318" ], //2044
    [ 0, "0217", "0319", "0417", "0517", "0615", "0714", "0813", "0911", "1010", "1109", "1208", "1307" ], //2045
    [ 0, "0206", "0308", "0406", "0506", "0604", "0704", "0802", "0901", "0930", "1029", "1128", "1227" ], //2046
    [ 5, "0126", "0225", "0326", "0425", "0525", "0623", "0723", "0821", "0920", "1019", "1117", "1217", "1315" ], //2047
    [ 0, "0214", "0314", "0413", "0513", "0611", "0711", "0810", "0908", "1008", "1106", "1205", "1304" ], //2048
    [ 0, "0202", "0304", "0402", "0502", "0531", "0630", "0730", "0828", "0927", "1027", "1125", "1225" ], //2049
    [ 3, "0123", "0221", "0323", "0421", "0521", "0619", "0719", "0817", "0916", "1016", "1114", "1214", "1313" ], //2050
    [ 0, "0211", "0313", "0411", "0510", "0609", "0708", "0806", "0905", "1005", "1103", "1203", "1302" ], //2051
    [ 8, "0201", "0301", "0331", "0429", "0528", "0627", "0726", "0824", "0923", "1022", "1121", "1221", "1320" ], //2052
    [ 0, "0219", "0320", "0419", "0518", "0616", "0716", "0814", "0912", "1012", "1110", "1210", "1309" ], //2053
    [ 0, "0208", "0309", "0408", "0508", "0606", "0705", "0804", "0902", "1001", "1031", "1129", "1229" ], //2054
    [ 6, "0128", "0226", "0328", "0427", "0526", "0625", "0724", "0823", "0921", "1020", "1119", "1218", "1317" ], //2055
    [ 0, "0215", "0316", "0415", "0515", "0613", "0713", "0811", "0910", "1009", "1107", "1207", "1305" ], //2056
    [ 0, "0204", "0305", "0404", "0504", "0602", "0702", "0731", "0830", "0929", "1028", "1126", "1226" ], //2057
    [ 4, "0124", "0223", "0324", "0423", "0522", "0621", "0720", "0819", "0918", "1017", "1116", "1216", "1314" ], //2058
    [ 0, "0212", "0314", "0412", "0512", "0610", "0710", "0808", "0907", "1006", "1105", "1205", "1304" ], //2059
    [ 0, "0202", "0303", "0401", "0501", "0530", "0628", "0727", "0826", "0924", "1024", "1123", "1223" ], //2060
    [ 3, "0121", "0220", "0322", "0420", "0519", "0618", "0717", "0815", "0914", "1013", "1112", "1212", "1311" ], //2061
    [ 0, "0209", "0311", "0410", "0509", "0607", "0707", "0805", "0903", "1003", "1101", "1201", "1231" ], //2062
    [ 7, "0129", "0228", "0330", "0428", "0528", "0626", "0726", "0824", "0922", "1022", "1120", "1220", "1318" ], //2063
    [ 0, "0217", "0318", "0417", "0516", "0615", "0714", "0813", "0911", "1010", "1109", "1208", "1307" ], //2064
    [ 0, "0205", "0307", "0406", "0505", "0604", "0704", "0802", "0901", "0930", "1029", "1128", "1227" ], //2065
    [ 5, "0126", "0224", "0326", "0424", "0524", "0623", "0722", "0821", "0919", "1019", "1117", "1217", "1315" ], //2066
    [ 0, "0214", "0315", "0414", "0513", "0612", "0711", "0810", "0909", "1008", "1107", "1206", "1305" ], //2067
    [ 0, "0203", "0304", "0402", "0502", "0531", "0629", "0729", "0828", "0926", "1026", "1125", "1224" ], //2068
    [ 4, "0123", "0221", "0323", "0421", "0521", "0619", "0718", "0817", "0915", "1015", "1114", "1214", "1312" ], //2069
    [ 0, "0211", "0312", "0411", "0510", "0609", "0708", "0806", "0905", "1004", "1103", "1203", "1301" ], //2070
    [ 8, "0131", "0302", "0331", "0430", "0529", "0628", "0727", "0825", "0924", "1023", "1122", "1221", "1320" ], //2071
    [ 0, "0219", "0320", "0418", "0518", "0616", "0716", "0814", "0912", "1012", "1110", "1210", "1308" ], //2072
    [ 0, "0207", "0309", "0407", "0507", "0605", "0704", "0803", "0901", "0930", "1030", "1128", "1228" ], //2073
    [ 6, "0126", "0225", "0326", "0425", "0525", "0623", "0723", "0821", "0920", "1019", "1118", "1217", "1316" ], //2074
    [ 0, "0214", "0316", "0414", "0514", "0612", "0712", "0811", "0909", "1009", "1107", "1207", "1305" ], //2075
    [ 0, "0204", "0304", "0403", "0502", "0601", "0630", "0730", "0828", "0927", "1027", "1125", "1225" ], //2076
    [ 0, "0123", "0222", "0323", "0422", "0521", "0620", "0719", "0818", "0917", "1017", "1115", "1215" ], //2077
    [ 0, "0113", "0212", "0313", "0412", "0511", "0609", "0709", "0807", "0906", "1006", "1104", "1204" ], //2078
    [ 0, "0103", "0201", "0303", "0401", "0501", "0530", "0628", "0728", "0826", "0925", "1024", "1123" ], //2079
    [ 3, "1223", "0122", "0220", "0321", "0419", "0519", "0617", "0716", "0815", "0913", "1012", "1111", "1211" ], //2080
    [ 0, "0110", "0208", "0310", "0409", "0508", "0607", "0706", "0804", "0903", "1002", "1031", "1130" ], //2081
    [ 7, "1230", "0128", "0227", "0329", "0428", "0527", "0625", "0725", "0823", "0922", "1021", "1119", "1219" ], //2082
    [ 0, "0118", "0216", "0318", "0417", "0516", "0615", "0714", "0813", "0911", "1011", "1109", "1209" ], //2083
    [ 0, "0107", "0206", "0306", "0405", "0504", "0603", "0703", "0801", "0831", "0929", "1029", "1127" ], //2084
    [ 5, "1227", "0125", "0224", "0325", "0423", "0523", "0622", "0721", "0820", "0919", "1018", "1117", "1216" ], //2085
    [ 0, "0115", "0213", "0315", "0413", "0512", "0611", "0710", "0809", "0908", "1007", "1106", "1206" ], //2086
    [ 0, "0104", "0203", "0304", "0403", "0502", "0531", "0630", "0729", "0828", "0926", "1026", "1125" ], //2087
    [ 4, "1225", "0123", "0222", "0322", "0421", "0520", "0618", "0718", "0816", "0914", "1014", "1113", "1213" ], //2088
    [ 0, "0111", "0210", "0312", "0410", "0510", "0608", "0707", "0806", "0904", "1003", "1102", "1202" ], //2089
    [ 8, "1231", "0130", "0301", "0331", "0429", "0529", "0627", "0726", "0825", "0923", "1022", "1121", "1221" ], //2090
    [ 0, "0119", "0218", "0320", "0418", "0518", "0616", "0716", "0814", "0913", "1012", "1110", "1210" ], //2091
    [ 0, "0108", "0207", "0308", "0406", "0506", "0605", "0704", "0803", "0901", "1001", "1030", "1129" ], //2092
    [ 6, "1228", "0126", "0225", "0327", "0425", "0525", "0623", "0723", "0822", "0920", "1020", "1118", "1218" ], //2093
    [ 0, "0116", "0214", "0316", "0414", "0514", "0612", "0712", "0811", "0909", "1009", "1108", "1207" ], //2094
    [ 0, "0106", "0204", "0306", "0404", "0503", "0602", "0701", "0731", "0829", "0928", "1028", "1127" ], //2095
    [ 4, "1226", "0125", "0223", "0324", "0422", "0521", "0620", "0719", "0817", "0916", "1016", "1115", "1214" ], //2096
    [ 0, "0113", "0212", "0313", "0412", "0511", "0609", "0709", "0807", "0905", "1005", "1104", "1203" ], //2097
    [ 0, "0102", "0201", "0303", "0401", "0501", "0530", "0628", "0727", "0826", "0924", "1024", "1122" ], //2098
    [ 2, "1222", "0121", "0220", "0321", "0420", "0520", "0618", "0717", "0816", "0914", "1013", "1112", "1211" ] ];
    var MINYEAR = 1900;
    var _chineseLunar = {};
    /*
     * 分析日期表达式，并提取其中的单位和数值
     */
    var _expression = function(expr) {
        var list = expr.match(/[+-]?\d+((ms)|[yMdhmsw])/g);
        var result = [];
        for (var i = 0; i < list.length; i++) {
            //提取单位和数值
            if (/([+-])(\d+)(.+)/.test(list[i])) {
                var val = parseInt(RegExp.$2);
                if (RegExp.$1 === "-") val = -val;
                result.push({
                    value: val,
                    unit: RegExp.$3
                });
            }
            return result;
        }
    };
    //计算公历两个日期之差
    var _solarDiff = function(left, right, interval) {
        var span = left.getTime() - right.getTime();
        //相差毫秒
        switch (interval) {
          case "y":
            return parseInt(left.getFullYear() - right.getFullYear());

          case "M":
            return parseInt((left.getFullYear() - right.getFullYear()) * 12 + (left.getMonth() - right.getMonth()));

          case "d":
            return Math.ceil(span / 1e3 / 60 / 60 / 24);

          case "w":
            return Math.floor(span / 1e3 / 60 / 60 / 24 / 7);

          case "h":
            return Math.floor(span / 1e3 / 60 / 60);

          case "m":
            return Math.floor(span / 1e3 / 60);

          case "s":
            return Math.floor(span / 1e3);

          case "ms":
            return parseInt(span);
        }
    };
    //_solarAdd(date, '5d-6m');
    var _solarAdd = function(date, expr) {};
    /*
     找到农历
     isPerYear，是否为农历前一年的对应数据
     */
    var _findLunar = function(solar, index, minMonth, maxMonth, isPreYear) {
        //取得映射的数据
        var mapping = MAPPING[index];
        if (!mapping) return false;
        var year = solar.getFullYear(), month = solar.getMonth() + 1, date = solar.getDate();
        var lunarYear = year;
        var lunarMonth, find, solarMonth;
        //查找农历
        for (var i = mapping.length - 1; i > 0; i--) {
            lunarMonth = i;
            //取对应的农历月与天
            var segMonth = Number(mapping[i].substring(0, 2));
            var segDay = Number(mapping[i].substring(2, 4));
            solarMonth = isPreYear && segMonth > 12 ? segMonth - 12 : segMonth;
            find = solarMonth < month || solarMonth == month && segDay <= date || (segMonth <= minMonth || segMonth >= maxMonth) && isPreYear;
            if (solarMonth == 12 && solarMonth > month && i == 1) {
                find = true;
                year--;
            }
            if (find) break;
        }
        //如果找到，则赋值
        if (!find) return false;
        //取前一年
        if (isPreYear && segMonth == 12) year = year - 1;
        lunarYear = isPreYear ? lunarYear - 1 : lunarYear;
        return {
            year: year,
            month: solarMonth,
            day: segDay,
            lunarYear: lunarYear,
            lunarMonth: lunarMonth,
            leapMonth: mapping[0]
        };
    };
    //日期累加
    var _dateAdd = function(lunar, value, unit) {
        if (unit == "M") {
            return _chineseLunar.monthAdd(lunar, value);
        } else {
            //转换为阳历，计算完再转为农历
            var solar = _chineseLunar.lunarToSolar(lunar);
            solar = _solarAdd(solar, value, unit);
            return _chineseLunar.solarToLunar(solar);
        }
    };
    /*
     农历相加
     */
    _chineseLunar.dateAdd = function(lunar, expr) {
        //分析表达式
        var list = _expression(expr);
        for (var i = 0; i < list.length; i++) {
            lunar = _dateAdd(lunar, list[i]);
        }
        return lunar;
    };
    /*
     计算两个农历时间的差值，主要计算月份之间的差，其它和公历是一样的
     */
    _chineseLunar.dateDiff = function(lunar1, lunar2, expr) {
        //计算农历月份差值
        if (expr == "M") {
            return _chineseLunar.monthDiff(lunar1, lunar2);
        }
        //先转成公历，除了月份，其它的都可以按公历计算
        var solar1 = _chineseLunar.lunarToSolar(lunar1);
        var solar2 = _chineseLunar.lunarToSolar(lunar2);
        //再把农历转到公历
        return _solarDiff(solar2, solar1, expr);
    };
    /*
     农历月份相加
     */
    _chineseLunar.monthAdd = function(lunar, inc) {
        //如果是Date，则转换为农历
        if (lunar instanceof Date) lunar = _chineseLunar.solarToLunar(lunar);
        if (inc == 0) return lunar;
        var year = lunar.year, count;
        var month = lunar.month;
        if (lunar.leap || lunar.leapMonth > 0 && lunar.month > lunar.leapMonth) month++;
        var run = true;
        do {
            //计算当前年有多少个月
            count = _chineseLunar.monthsOfYear(year);
            inc = inc + month - count;
            if (inc <= 0) {
                run = false;
                month = year == lunar.year ? count + inc : count + inc - month;
            } else {
                year++;
                month = 1;
            }
        } while (run);
        //获取最后的结果年的闰月是哪一个月
        var leapMonth = _chineseLunar.leapMonthOfYear(year);
        var leap = false;
        //如果闰月大于农历月，则月份减1
        if (leapMonth > 0 && month > leapMonth) {
            month--;
            //如果减完后月份和闰月相等，表示是闰月
            leap = month == leapMonth;
        }
        return {
            year: year,
            month: month,
            leap: leap,
            leapMonth: leapMonth
        };
    };
    /*
     * 返回两段日期的农历差了多少个月，因为有闰月，所以和公历不一样
     * date1和date2允许为公历
     */
    _chineseLunar.monthDiff = function(lunar1, lunar2) {
        //如果是公历的日期格式，则转换为农历
        var count = 0;
        //如果数据类型是日期，则转换为农历
        if (lunar1 instanceof Date) lunar1 = _chineseLunar.solarToLunar(lunar1);
        if (lunar2 instanceof Date) lunar2 = _chineseLunar.solarToLunar(lunar2);
        //两个日期是同一年
        if (lunar1.year == lunar2.year) {
            count = lunar2.month - lunar1.month;
            //中间有闰月的存在，计数器加一
            if (lunar1.leapMonth >= lunar1.month && lunar1.leapMonth <= lunar2.month) count++;
        } else {
            //计算首年，如果当前的闰月大于当前月，或者当前年有闰月且当前月等于闰月，但当前月又不是闰月，则要多添加一个月
            count = 12;
            if (lunar1.leapMonth > lunar1.month || lunar1.leapMonth == lunar1.month && !lunar1.isLeaMonth) count += 1;
            count -= lunar1.month;
            //计算两年之间中间的年月份
            var year = lunar1.year + 1;
            for (var i = year; i < lunar2.year; i++) {
                count += _chineseLunar.monthsOfYear(year++);
            }
            //计算最后一年
            count += lunar2.month;
            if (lunar2.isLeapMonth || lunar2.month < lunar2.leapMonth) count++;
        }
        return count;
    };
    /*
     * 计算某年某月一个有多少天
     * daysOfMonth({}) 或者 daysOfMonth(year, month, leap);
     */
    _chineseLunar.daysOfMonth = function(year, month, leap) {
        if (typeof year == "object") {
            month = year.month;
            leap = year.leap;
            year = year.year;
        }
        var date1 = _chineseLunar.lunarToSolar(year, month, 1, leap);
        var leapMonth = _chineseLunar.leapMonthOfYear(year);
        if (leapMonth == month && !leap) {
            //如果是闰月和当前一月一至，且当前月不是闰月，说明下一个月是闰月，例如2009年5月，这一年闰5月，如果传过来的不是闰月，那么下一个月就是闰月
            leap = true;
        } else if (month == 12) {
            //农历的最后一个月
            year++;
            month = 1;
        } else {
            leap = false;
            month++;
        }
        var date2 = _chineseLunar.lunarToSolar(year, month, 1, leap);
        return _dateDiff(date2, date1, "d");
    };
    //获取农历某一年有多少个月
    _chineseLunar.monthsOfYear = function(year) {
        return MAPPING[year - MINYEAR].length - 1;
    };
    //获取农历某年的闰月是几月，
    _chineseLunar.leapMonthOfYear = function(year) {
        var info = MAPPING[year - MINYEAR];
        return info ? info[0] : 0;
    };
    /*
     农历转阳历
     lunarToSolar({})，或者lunarToSolar(year, month, day, leap)
     */
    _chineseLunar.lunarToSolar = function(year, month, day, leap) {
        var arg0 = arguments[0];
        //第一个参数是对象
        if (typeof arg0 == "object" && arguments.length == 1) {
            year = arg0.year;
            month = arg0.month;
            day = arg0.day;
            leap = arg0.leap;
        }
        //根据偏移量取得映射数据
        var offset = year - MINYEAR;
        //所查询的日期超出范围
        if (offset < 0 || offset > MAPPING.length) {
            throw new Error("Specified date range is invalid.");
        }
        //取得润月是哪一个月
        var leapMonth = MAPPING[offset][0];
        //如果isLeap=true，并且当前月份就是闰月，或者本月有闰月，且当前月份大于闰月，则月份需要加1
        if (leap && month == leapMonth || leapMonth > 0 && month > leapMonth) {
            month += 1;
        }
        //取出对应到某个月的片断
        var segment = MAPPING[offset][month];
        //农历第一天对应公历的具体天
        var mapMonth = Number(segment.substring(0, 2));
        var mapDate = Number(segment.substring(2, 4));
        if (mapMonth > 12) {
            year += 1;
            mapMonth -= 12;
        }
        var solar = new Date(year, mapMonth - 1, mapDate);
        var time = solar.getTime() + (day - 1) * 24 * 60 * 60 * 1e3;
        return new Date(time);
    };
    /*
     公历转农历
     1.查找对应农历初一是哪一天
     2.将农历初一转换为公历
     3.计入偏移量
     */
    _chineseLunar.solarToLunar = function(solar, format) {
        var offset = solar.getFullYear() - MINYEAR;
        //超出范围
        if (offset <= 0 || offset >= MAPPING.length) {
            throw new Error("Specified date range is invalid.");
        }
        //查找范围内的农历数据
        var data = _findLunar(solar, offset, 0, 13, false);
        //如果没有找到，则找前一年的，因为农历在公历之前，并且不会超过一年，查一年就可以了
        data = data || _findLunar(solar, offset - 1, 12, 99, true);
        //还是没有找到，表示超出范围
        if (!data) return false;
        //农历初一对应公历的哪一天
        var firstDay = new Date(data.year, data.month - 1, data.day);
        var day = _solarDiff(solar, firstDay, "d") + 1;
        //返回的农历结果
        var result = {
            leap: data.leapMonth > 0 && data.leapMonth + 1 == data.lunarMonth,
            year: data.lunarYear,
            month: data.leapMonth > 0 && data.lunarMonth > data.leapMonth ? data.lunarMonth - 1 : data.lunarMonth,
            day: day,
            leapMonth: data.leapMonth
        };
        //判断是否要格式化结果
        return format && result ? _chineseLunar.format(result, format) : result;
    };
    //获取中国传统干支的名称
    _chineseLunar.traditionalYearName = function(year) {
        var Gan = "甲乙丙丁戊己庚辛壬癸".split("");
        var Zhi = "子丑寅卯辰巳午未申酉戌亥".split("");
        year = year - MINYEAR + 36;
        return Gan[year % 10] + Zhi[year % 12] + "年";
    };
    //获取中文的年
    _chineseLunar.yearName = function(year) {
        var cnStr = "〇,一,二,三,四,五,六,七,八,九".split(",");
        var cYear = year.toString();
        var result = "";
        for (var i = 0; i < cYear.length; i++) {
            result += cnStr[parseInt(cYear.charAt(i))];
        }
        return result + "年";
    };
    //获取中国的生肖
    _chineseLunar.animalName = function(year) {
        return "鼠牛虎兔龙蛇马羊猴鸡狗猪".split("")[(year - 4) % 12];
    };
    //获取农历月的名称
    _chineseLunar.monthName = function(month, traditional, leap) {
        var monthName = "正,二,三,四,五,六,七,八,九,十,十一,十二".split(",");
        if (traditional) {
            monthName[11] = "腊";
        }
        return (leap ? "闰" : "") + monthName[month - 1] + "月";
    };
    //获取农历传统天的名称
    _chineseLunar.dayName = function(lunar) {
        switch (lunar) {
          case 10:
            return "初十";

          case 20:
            return "二十";

          case 30:
            return "三十";

          default:
            return "初十廿卅".split("")[Math.floor(lunar / 10)] + "一二三四五六七八九十".split("")[(lunar - 1) % 10] || lunar;
        }
    };
    //格式化农历日期，date是农历的日期
    _chineseLunar.format = function(lunar, expr) {
        return expr.replace(/[TAYyMmdD]/g, function(m, i) {
            switch (m) {
              //获取传统的年
                case "T":
                return _chineseLunar.traditionalYearName(lunar.year);

              //获取生肖
                case "A":
                return _chineseLunar.animalName(lunar.year);

              //获取中文的年
                case "Y":
                return _chineseLunar.yearName(lunar.year);

              //获取数字年
                case "y":
                return lunar.year;

              //获取月份
                case "m":
                return _chineseLunar.monthName(lunar.month, false, lunar.leap);

              //获取传统的月
                case "M":
                return _chineseLunar.monthName(lunar.month, true, lunar.leap);

              //获取天
                case "d":
                return _chineseLunar.dayName(lunar.day);

              //如果是初一，则显示月，而不是显示
                case "D":
                if (lunar.day == 1) {
                    return _chineseLunar.monthName(lunar.month, false, lunar.leap);
                } else {
                    return _chineseLunar.dayName(lunar.day);
                }
                ;
            }
        });
    };
    if (typeof define === "function") {
        define("alinw/calendar/1.1.17/chinese-lunar-debug", [], function() {
            return _chineseLunar;
        });
    } else if (typeof exports === "object") {
        module.exports = _chineseLunar;
    } else {
        window.chineseLunar = _chineseLunar;
    }
})();

define("alinw/calendar/1.1.17/month-column-debug", [ "$-debug", "gallery/moment/2.8.1/moment-debug", "alinw/calendar/1.1.17/base-column-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.8.1/moment-debug");
    var BaseColumn = require("alinw/calendar/1.1.17/base-column-debug");
    var MonthColumn = BaseColumn.extend({
        attrs: {
            template: template,
            process: null,
            model: {
                getter: function() {
                    return createMonthModel(this.get("focus"), this.get("process"), this);
                }
            }
        },
        events: {
            "click [data-role=month]": function(ev) {
                var el = $(ev.target);
                var value = el.data("value");
                this.select(value, el);
            }
        },
        setup: function() {
            MonthColumn.superclass.setup.call(this);
            this.on("change:range", function() {
                this.element.html($(this.compileTemplate()).html());
            });
        },
        prev: function() {
            var focus = this.get("focus").add("months", -1);
            return this._sync(focus);
        },
        next: function() {
            var focus = this.get("focus").add("months", 1);
            return this._sync(focus);
        },
        select: function(value, el) {
            if (el && el.hasClass("disabled-element")) {
                this.trigger("selectDisable", value, el);
                return value;
            }
            var focus;
            if (value.month) {
                focus = value;
            } else {
                focus = this.get("focus").month(value);
            }
            return this._sync(focus, el);
        },
        focus: function(focus) {
            focus = focus || this.get("focus");
            var selector = "[data-value=" + focus.month() + "]";
            this.element.find(".focused-element").removeClass("focused-element");
            this.element.find(selector).addClass("focused-element");
        },
        refresh: function() {
            var focus = this.get("focus").year();
            var year = this.element.find("[data-year]").data("year");
            if (parseInt(year, 10) !== focus) {
                this.element.html($(this.compileTemplate()).html());
            }
        },
        inRange: function(date) {
            var range = this.get("range");
            if (date.month) {
                return isInRange(date, range);
            }
            if (date.toString().length < 3) {
                var time = this.get("focus");
                return isInRange(time.clone().month(date), range);
            }
            return isInRange(moment(date, this.get("format")), range);
        },
        _sync: function(focus, el) {
            this.set("focus", focus);
            this.refresh();
            this.focus(focus);
            // if user call select(value, null) it will not trigger an event
            if (el !== null) {
                this.trigger("select", focus.month(), el);
            }
            return focus;
        }
    });
    module.exports = MonthColumn;
    // helpers
    var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    function createMonthModel(time, fn, ctx) {
        var month = time.month();
        var items = [];
        for (i = 0; i < MONTHS.length; i++) {
            var item = {
                value: i,
                available: ctx.inRange.call(ctx, i),
                label: MONTHS[i]
            };
            if (fn) {
                item.type = "month";
                item = fn(item);
            }
            items.push(item);
        }
        var current = {
            year: time.year(),
            value: month,
            label: MONTHS[month]
        };
        // split [1, 2, .. 12] to [[1, 2, 3, 4], [5, ...]...]
        var list = [];
        for (var i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }
        return {
            current: current,
            items: list
        };
    }
    function isInRange(d, range) {
        // reset to the first day
        if (range == null) {
            return true;
        }
        if ($.isArray(range)) {
            var start = range[0];
            var end = range[1];
            var result = true;
            if (start && start.month) {
                var lastDate = d.clone().date(d.daysInMonth());
                lastDate.hour(23).minute(59).second(59).millisecond(999);
                result = result && lastDate >= start;
            } else if (start) {
                result = result && d.month() + 1 >= start;
            }
            if (end && end.month) {
                var firstDate = d.clone().date(1);
                firstDate.hour(0).minute(0).second(0).millisecond(0);
                result = result && firstDate <= end;
            } else if (end) {
                result = result && d.month() + 1 <= end;
            }
            return result;
        }
        return true;
    }
    /* template in handlebars
     <table class="ui-calendar-month" data-role="month-column">
     {{#each items}}
     <tr class="ui-calendar-month-column">
     {{#each this}}
     <td class="{{#unless available}}disabled-element{{/unless}}" data-role="month" data-value="{{value}}">{{_ label}}</td>
     {{/each}}
     </tr>
     {{/each}}
     </table>
     */
    function template(model, options) {
        var _ = options.helpers._;
        var html = '<table class="ui-calendar-month" data-role="month-column">';
        $.each(model.items, function(i, items) {
            html += '<tr class="ui-calendar-month-column" data-year="' + model.current.year + '">';
            $.each(items, function(i, item) {
                html += '<td data-role="month"';
                if (!item.available) {
                    html += ' class="disabled-element"';
                }
                html += 'data-value="' + item.value + '">';
                html += _(item.label) + "</td>";
            });
            html += "</tr>";
        });
        html += "</table>";
        return html;
    }
});

define("alinw/calendar/1.1.17/year-column-debug", [ "$-debug", "alinw/calendar/1.1.17/base-column-debug", "gallery/moment/2.8.1/moment-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var BaseColumn = require("alinw/calendar/1.1.17/base-column-debug");
    var YearColumn = BaseColumn.extend({
        attrs: {
            process: null,
            template: template,
            model: {
                getter: function() {
                    return createYearModel(this.get("focus"), this.get("range"), this.get("process"));
                }
            }
        },
        events: {
            "click [data-role=year],[data-role=previous-10-year],[data-role=next-10-year]": function(ev) {
                var el = $(ev.target);
                var value = el.data("value");
                this.select(value, el);
            }
        },
        setup: function() {
            YearColumn.superclass.setup.call(this);
            this.on("change:range", function() {
                this.element.html($(this.compileTemplate()).html());
            });
        },
        prev: function() {
            var focus = this.get("focus").add("years", -1);
            return this._sync(focus);
        },
        next: function() {
            var focus = this.get("focus").add("years", 1);
            return this._sync(focus);
        },
        select: function(value, el) {
            if (el && el.hasClass("disabled-element")) {
                this.trigger("selectDisable", value, el);
                return value;
            }
            var focus;
            if (value.year) {
                focus = value;
            } else {
                focus = this.get("focus").year(value);
            }
            return this._sync(focus, el);
        },
        focus: function(focus) {
            focus = focus || this.get("focus");
            var selector = "[data-value=" + focus.year() + "]";
            this.element.find(".focused-element").removeClass("focused-element");
            this.element.find(selector).addClass("focused-element");
        },
        refresh: function() {
            var focus = this.get("focus").year();
            var years = this.element.find("[data-role=year]");
            if (focus < years.first().data("value") || focus > years.last().data("value")) {
                this.element.html($(this.compileTemplate()).html());
            }
        },
        inRange: function(date) {
            return isInRange(date, this.get("range"));
        },
        _sync: function(focus, el) {
            this.set("focus", focus);
            this.refresh();
            this.focus(focus);
            if (el !== null) {
                this.trigger("select", focus.year(), el);
            }
            return focus;
        }
    });
    module.exports = YearColumn;
    // helpers
    function createYearModel(time, range, fn) {
        var year = time.year();
        var items = [ process({
            value: year - 10,
            label: ". . .",
            available: true,
            role: "previous-10-year"
        }, fn) ];
        for (var i = year - 6; i < year + 4; i++) {
            items.push(process({
                value: i,
                label: i,
                available: isInRange(i, range),
                role: "year"
            }, fn));
        }
        items.push(process({
            value: year + 10,
            label: ". . .",
            available: true,
            role: "next-10-year"
        }, fn));
        var list = [];
        for (i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }
        var current = {
            value: year,
            label: year
        };
        return {
            current: current,
            items: list
        };
    }
    function process(item, fn) {
        if (!fn) {
            return item;
        }
        item.type = "year";
        return fn(item);
    }
    function isInRange(date, range) {
        if (range == null) {
            return true;
        }
        if ($.isArray(range)) {
            var start = range[0];
            if (start && start.year) {
                start = start.year();
            }
            var end = range[1];
            if (end && end.year) {
                end = end.year();
            }
            var result = true;
            if (start) {
                result = result && date >= start;
            }
            if (end) {
                result = result && date <= end;
            }
            return result;
        }
        return true;
    }
    /* template in handlebars
     <table class="ui-calendar-year" data-role="year-column">
     {{#each items}}
     <tr class="ui-calendar-year-column">
     {{#each this}}
     <td {{#unless available}}class="disabled-element"{{/unless}} data-role="{{role}}" data-value="{{value}}">{{_ label}}</td>
     {{/each}}
     </tr>
     {{/each}}
     </table>
     */
    function template(model, options) {
        var _ = options.helpers._;
        var html = '<table class="ui-calendar-year" data-role="year-column">';
        $.each(model.items, function(i, items) {
            html += '<tr class="ui-calendar-year-column">';
            $.each(items, function(i, item) {
                html += '<td data-role="' + item.role + '"';
                if (!item.available) {
                    html += ' class="disabled-element"';
                }
                html += 'data-value="' + item.value + '">';
                html += _(item.label) + "</td>";
            });
            html += "</tr>";
        });
        html += "</table>";
        return html;
    }
});

define("alinw/calendar/1.1.17/time-column-debug", [ "$-debug", "alinw/tip/2.1.0/tip-debug", "arale/tip/1.2.2/tip-debug", "arale/popup/1.1.6/popup-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "alinw/calendar/1.1.17/base-column-debug", "gallery/moment/2.8.1/moment-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var Tip = require("alinw/tip/2.1.0/tip-debug");
    var BaseColumn = require("alinw/calendar/1.1.17/base-column-debug");
    var TimeColumn = BaseColumn.extend({
        attrs: {
            process: null,
            template: template,
            model: {
                getter: function() {
                    var focus = this.get("focus");
                    /*
                     * @ermin.zem
                     * + showHour +
                     * + showMinute +
                     * + showSecond +
                     * + halfHour +
                     */
                    var minute = focus.minute();
                    var second = focus.second();
                    var halfHour = this.get("halfHour");
                    if (halfHour) {
                        if (minute != 0) {
                            minute = minute < 30 ? 0 : 30;
                        }
                        second = 0;
                        focus.minute(minute);
                        focus.second(second);
                        this.set("focus", focus);
                    }
                    return {
                        hour: focus.hour(),
                        minute: minute,
                        second: second,
                        showHour: this.get("showHour"),
                        showMinute: this.get("showMinute"),
                        showSecond: this.get("showSecond")
                    };
                }
            },
            tipInited: false
        },
        events: {
            hover: "_initTips",
            "click .ui-calendar-time-input": "_selectInputText",
            "keyup .ui-calendar-time-input": "_formatInput",
            "blur .ui-calendar-time-input": "_selectTime",
            "click .kuma-button-sblue": "_test"
        },
        setup: function() {
            var self = this;
            TimeColumn.superclass.setup.call(this);
            /* 注册事件: 选择时间 */
            $("body").on("mousedown", ".time-table td", function() {
                var value = $(this).data("value");
                self.select(value, $(this));
                if (self.inputTip) self.inputTip.hide();
            });
        },
        _initTips: function() {
            if (!this.get("tipInited")) {
                this.set("tipInited", true);
                this.inputTip = new Tip({
                    trigger: ".ui-calendar-time-input",
                    zIndex: this.get("zIndex") + 1,
                    arrowPosition: 6
                }).before("show", function() {
                    var role = this.activeTrigger.data("role"), tipCont = $("[data-role=" + role + "-tip]");
                    this.set("content", tipCont.html());
                });
            }
        },
        _selectInputText: function(e) {
            e.target.select();
        },
        _formatInput: function(e) {
            var el = $(e.target), val = el.val().replace(/\D/g, ""), role = el.data("role").split("-")[1];
            if (role == "hour") {
                if (val > 23) val = 24;
            } else {
                if (val > 59) val = 59;
            }
            el.val(val);
        },
        _selectTime: function(e) {
            var focus = this.get("focus"), hour = this.element.find("[data-role=time-hour]").val(), minute = this.element.find("[data-role=time-minute]").val(), second = this.element.find("[data-role=time-second]").val();
            if (hour >= 0 && hour < 24) focus.hour(hour);
            if (minute >= 0 && minute < 60) focus.minute(minute);
            if (second >= 0 && second < 60) focus.second(second);
            this.focus();
        },
        select: function(value, el) {
            var role = el.data("role").split("-")[1], focus = this.get("focus");
            if (role == "hour") {
                focus.hour(value);
            }
            if (role == "minute") {
                focus.minute(value);
            }
            if (role == "second") {
                focus.second(value);
            }
            this._sync(focus, el);
        },
        focus: function(focus, up) {
            if (focus) {
                if (up) {
                    this.set("focus", focus);
                }
            } else {
                focus = this.get("focus");
            }
            var hour = focus.hour(), minute = focus.minute(), second = focus.second();
            $(".time-table").find(".focused-element").removeClass("focused-element");
            $("[data-role=time-hour-item]").filter("[data-value=" + hour + "]").addClass("focused-element");
            $("[data-role=time-minute-item]").filter("[data-value=" + minute + "]").addClass("focused-element");
            $("[data-role=time-second-item]").filter("[data-value=" + second + "]").addClass("focused-element");
            this.element.find("[data-role=time-hour]").val(("00" + hour).slice(-2));
            this.element.find("[data-role=time-minute]").val(("00" + minute).slice(-2));
            this.element.find("[data-role=time-second]").val(("00" + second).slice(-2));
        },
        _sync: function(focus, el) {
            this.set("focus", focus);
            this.focus(focus);
            return focus;
        },
        _test: function() {
            var focus = this.get("focus");
            this.trigger("select", [ focus.hour(), focus.minute(), focus.second() ]);
        }
    });
    module.exports = TimeColumn;
    function template(model, options) {
        var html = '<div class="ui-calendar-time-container">';
        html += '<div class="ui-calendar-time-input-cont">';
        if (model.showHour) {
            html += '<input type="text" data-role="time-hour" class="ui-calendar-time-input" value="' + ("00" + model.hour).slice(-2) + '" />';
            if (model.showMinute) html += '<span class="ui-calendar-time-sep">:</span>';
        }
        if (model.showMinute) {
            html += '<input type="text" data-role="time-minute" class="ui-calendar-time-input" value="' + ("00" + model.minute).slice(-2) + '" >';
            if (model.showSecond) html += '<span class="ui-calendar-time-sep">:</span>';
        }
        if (model.showSecond) {
            html += '<input type="text" data-role="time-second" class="ui-calendar-time-input" value="' + ("00" + model.second).slice(-2) + '" />';
        }
        html += '<button data-role="time-button" class="kuma-button kuma-button-sblue">' + options.helpers._("OK") + "</button>";
        html += "</div>";
        html += '<div class="ui-calendar-tip-cont">';
        /* 小时 */
        html += '<div data-role="time-hour-tip"><table class="time-table">';
        for (var i = 0; i < 24; i++) {
            var clas = i == model.hour ? "focused-element" : "";
            var str = '<td data-role="time-hour-item" data-value="' + i + '" class="' + clas + '">' + i + "</td>";
            var temp = i % 6;
            if (temp === 0) str = "<tr>" + str;
            if (temp === 5) str = str + "</tr>";
            html += str;
        }
        html += "</table></div>";
        /* 分钟 */
        html += '<div data-role="time-minute-tip"><table class="time-table">';
        for (var i = 0; i < 60; i += 5) {
            var clas = i == model.minute ? "focused-element" : "";
            var str = '<td data-role="time-minute-item" data-value="' + i + '" clsas="' + clas + '">' + i + "</td>";
            var temp = i % 26;
            if (temp === 0) str = "<tr>" + str;
            if (temp === 25) str = str + "</tr>";
            html += str;
        }
        html += "</table></div>";
        /* 秒 */
        html += '<div data-role="time-second-tip"><table class="time-table">';
        for (var i = 0; i < 60; i += 5) {
            var clas = i == model.second ? "focused-element" : "";
            var str = '<td data-role="time-second-item" data-value="' + i + '" class="' + clas + '">' + i + "</td>";
            var temp = i % 26;
            if (temp === 0) str = "<tr>" + str;
            if (temp === 25) str = str + "</tr>";
            html += str;
        }
        html += "</table></div>";
        html += "</div>";
        html += "</div>";
        return html;
    }
});
