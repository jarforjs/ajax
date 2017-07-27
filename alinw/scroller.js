/**
 * Created by Administrator on 2017-04-06.
 */
/**
 * Created by Samoay on 7/27/14.
 */
define("alinw/scroller/1.0.1/scroller-debug", [ "$-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Widget = require("arale/widget/1.1.1/widget-debug");
    var Scroller = Widget.extend({
        attrs: {
            $body: null,
            customClass: "",
            duration: 0,
            handleSize: 0,
            horizontal: false,
            trackMargin: 0
        },
        setup: function() {
            if (this.get("$body") === null) {
                this.set("$body", $("body"));
            }
            // Local options
            var opts = {
                customClass: this.get("customClass"),
                duration: this.get("duration"),
                handleSize: this.get("handleSize"),
                horizontal: this.get("horizontal"),
                trackMargin: this.get("trackMargin")
            };
            // Apply to each element
            var $items = this.get("trigger");
            for (var i = 0, count = $items.length; i < count; i++) {
                this._build($items.eq(i), opts);
            }
            return $items;
        },
        destory: function(selector) {
            var scrollers = selector !== undefined ? $(selector) : this.get("trigger");
            return scrollers.each(function(i, el) {
                var data = $(el).data("scroller");
                if (!data) {
                    return;
                }
                data.$scroller.removeClass(data.customClass).removeClass("kuma-scroller").removeClass("kuma-scroller-active");
                data.$bar.remove();
                data.$content.contents().unwrap();
                data.$content.off(".kuma-scroller");
                data.$scroller.off(".kuma-scroller").removeData("scroller");
            });
        },
        scroll: function(pos, dur, selector) {
            var self = this, scrollers = self.get("trigger"), duration = self.get("duration");
            if (arguments.length == 2) {
                if (typeof dur !== "number") {
                    scrollers = $(dur);
                } else {
                    duration = dur;
                }
            }
            if (arguments.length == 3) {
                scrollers = $(selector);
                duration = dur;
            }
            return scrollers.each(function() {
                var data = $(this).data("scroller");
                if (typeof pos !== "number") {
                    var $el = $(pos);
                    if ($el.length > 0) {
                        var offset = $el.position();
                        if (data.horizontal) {
                            pos = offset.left + data.$content.scrollLeft();
                        } else {
                            pos = offset.top + data.$content.scrollTop();
                        }
                    } else {
                        pos = data.$content.scrollTop();
                    }
                }
                if (data.horizontal) {
                    data.$content.stop().animate({
                        scrollLeft: pos
                    }, duration);
                } else {
                    data.$content.stop().animate({
                        scrollTop: pos
                    }, duration);
                }
            });
        },
        reset: function(selector) {
            var self = this;
            var scrollers = selector !== undefined ? $(selector) : self.get("trigger");
            return scrollers.each(function(i, item) {
                var data = $(item).data("scroller");
                if (!data) {
                    return;
                }
                data.$scroller.addClass("kuma-scroller-setup");
                if (data.horizontal) {
                    // Horizontal
                    var padding = parseInt($(item).css("padding-left"), 10) + parseInt($(item).css("padding-right"), 10);
                    data.barHeight = data.$content[0].offsetHeight - data.$content[0].clientHeight;
                    data.frameWidth = data.$content.outerWidth() + padding;
                    data.trackWidth = data.frameWidth - data.trackMargin * 2;
                    data.scrollWidth = data.$content[0].scrollWidth;
                    data.ratio = data.trackWidth / data.scrollWidth;
                    data.trackRatio = data.trackWidth / data.scrollWidth;
                    data.handleWidth = data.handleSize > 0 ? data.handleSize : data.trackWidth * data.trackRatio;
                    data.scrollRatio = (data.scrollWidth - data.frameWidth) / (data.trackWidth - data.handleWidth);
                    data.handleBounds = {
                        left: 0,
                        right: data.trackWidth - data.handleWidth
                    };
                    data.$content.css({
                        paddingBottom: data.barHeight + data.paddingBottom
                    });
                    var scrollLeft = data.$content.scrollLeft(), handleLeft = scrollLeft * data.ratio;
                    if (data.scrollWidth <= data.frameWidth) {
                        data.$scroller.removeClass("kuma-scroller-active");
                    } else {
                        data.$scroller.addClass("kuma-scroller-active");
                    }
                    data.$bar.css({
                        width: data.frameWidth
                    });
                    data.$track.css({
                        width: data.trackWidth,
                        marginLeft: data.trackMargin,
                        marginRight: data.trackMargin
                    });
                    data.$handle.css({
                        width: data.handleWidth
                    });
                    self._position.apply(data.$scroller, [ data, handleLeft ]);
                } else {
                    // Vertical
                    var padding = parseInt($(item).css("padding-top"), 10) + parseInt($(item).css("padding-bottom"), 10);
                    data.barWidth = data.$content[0].offsetWidth - data.$content[0].clientWidth;
                    data.frameHeight = data.$content.outerHeight() + padding;
                    data.trackHeight = data.frameHeight - data.trackMargin * 2;
                    data.scrollHeight = data.$content[0].scrollHeight;
                    data.ratio = data.trackHeight / data.scrollHeight;
                    data.trackRatio = data.trackHeight / data.scrollHeight;
                    data.handleHeight = data.handleSize > 0 ? data.handleSize : data.trackHeight * data.trackRatio;
                    data.scrollRatio = (data.scrollHeight - data.frameHeight + padding) / (data.trackHeight - data.handleHeight);
                    data.handleBounds = {
                        top: 0,
                        bottom: data.trackHeight - data.handleHeight
                    };
                    var scrollTop = data.$content.scrollTop(), handleTop = scrollTop * data.ratio;
                    if (data.scrollHeight <= data.frameHeight) {
                        data.$scroller.removeClass("kuma-scroller-active");
                    } else {
                        data.$scroller.addClass("kuma-scroller-active");
                    }
                    data.$bar.css({
                        height: data.frameHeight
                    });
                    data.$track.css({
                        height: data.trackHeight,
                        marginBottom: data.trackMargin,
                        marginTop: data.trackMargin
                    });
                    data.$handle.css({
                        height: data.handleHeight
                    });
                    self._position.apply(data.$scroller, [ data, handleTop ]);
                }
                data.$scroller.removeClass("kuma-scroller-setup");
            });
        },
        /**
         * @method private
         * @name _build
         * @description Builds each instance
         * @param $scroller [jQuery object] "Target jQuery object"
         * @param opts [object] <{}> "Options object"
         */
        _build: function($scroller, opts) {
            if (!$scroller.hasClass("kuma-scroller")) {
                // EXTEND OPTIONS
                opts = $.extend({}, opts, $scroller.data("scroller-options"));
                var html = "";
                html += '<div class="kuma-scroller-bar">';
                html += '<div class="kuma-scroller-track">';
                html += '<div class="kuma-scroller-handle">';
                html += "</div></div></div>";
                opts.paddingRight = parseInt($scroller.css("padding-right"), 10);
                opts.paddingBottom = parseInt($scroller.css("padding-bottom"), 10);
                $scroller.addClass(opts.customClass + " kuma-scroller").wrapInner('<div class="kuma-scroller-content" />').prepend(html);
                if (opts.horizontal) {
                    $scroller.addClass("kuma-scroller-horizontal");
                }
                var data = $.extend({
                    uuid: $scroller.data("uuid") || new Date().getTime(),
                    $scroller: $scroller,
                    $content: $scroller.find(".kuma-scroller-content"),
                    $bar: $scroller.find(".kuma-scroller-bar"),
                    $track: $scroller.find(".kuma-scroller-track"),
                    $handle: $scroller.find(".kuma-scroller-handle")
                }, opts);
                data.trackMargin = parseInt(data.trackMargin, 10);
                var self = this;
                data.$content.on("scroll.kuma-scroller", data, function(e) {
                    self._onScroll.call(self, e);
                });
                $($scroller).on("touchstart.kuma-scroller mousedown.kuma-scroller", ".kuma-scroller-track", data, function(e) {
                    self._onTrackDown.call(self, e);
                }).on("touchstart.kuma-scroller mousedown.kuma-scroller", ".kuma-scroller-handle", data, function(e) {
                    self._onHandleDown.call(self, e);
                }).data("scroller", data);
                self.reset.call(self);
                $(window).one("load", function() {
                    self.reset.call(self);
                });
            }
        },
        /**
         * @method private
         * @name _onScroll
         * @description Handles scroll event
         * @param e [object] "Event data"
         */
        _onScroll: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var data = e.data;
            if (data.horizontal) {
                // Horizontal
                var scrollLeft = data.$content.scrollLeft();
                if (scrollLeft < 0) {
                    scrollLeft = 0;
                }
                var handleLeft = scrollLeft / data.scrollRatio;
                if (handleLeft > data.handleBounds.right) {
                    handleLeft = data.handleBounds.right;
                }
                data.$handle.css({
                    left: handleLeft
                });
            } else {
                // Vertical
                var scrollTop = data.$content.scrollTop();
                if (scrollTop < 0) {
                    scrollTop = 0;
                }
                var handleTop = scrollTop / data.scrollRatio;
                if (handleTop > data.handleBounds.bottom) {
                    handleTop = data.handleBounds.bottom;
                }
                data.$handle.css({
                    top: handleTop
                });
            }
        },
        /**
         * @method private
         * @name _onTrackDown
         * @description Handles mousedown event on track
         * @param e [object] "Event data"
         */
        _onTrackDown: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var data = e.data, oe = e.originalEvent, offset = data.$track.offset(), touch = typeof oe.targetTouches !== "undefined" ? oe.targetTouches[0] : null;
            var pageX = touch ? touch.pageX : e.clientX, pageY = touch ? touch.pageY : e.clientY;
            if (data.horizontal) {
                // Horizontal
                data.mouseStart = pageX;
                data.handleLeft = pageX - offset.left - data.handleWidth / 2;
                this._position.apply(data.$scroller, [ data, data.handleLeft ]);
            } else {
                // Vertical
                data.mouseStart = pageY;
                data.handleTop = pageY - offset.top - data.handleHeight / 2;
                this._position.apply(data.$scroller, [ data, data.handleTop ]);
            }
            data.$content.off(".kuma-scroller");
            var self = this;
            self.get("$body").on("touchmove.kuma-scroller mousemove.kuma-scroller", data, function(e) {
                self._onMouseMove.call(self, e);
            }).on("touchend.kuma-scroller mouseup.kuma-scroller", data, function(e) {
                self._onMouseUp.call(self, e);
            });
        },
        /**
         * @method private
         * @name _onHandleDown
         * @description Handles mousedown event on handle
         * @param e [object] "Event data"
         */
        _onHandleDown: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var data = e.data, oe = e.originalEvent, touch = typeof oe.targetTouches !== "undefined" ? oe.targetTouches[0] : null;
            var pageX = touch ? touch.pageX : e.clientX, pageY = touch ? touch.pageY : e.clientY;
            if (data.horizontal) {
                // Horizontal
                data.mouseStart = pageX;
                data.handleLeft = parseInt(data.$handle.css("left"), 10);
            } else {
                // Vertical
                data.mouseStart = pageY;
                data.handleTop = parseInt(data.$handle.css("top"), 10);
            }
            data.$content.off(".kuma-scroller");
            var self = this;
            self.get("$body").on("touchmove.kuma-scroller mousemove.kuma-scroller", data, function(e) {
                self._onMouseMove.call(self, e);
            }).on("touchend.kuma-scroller mouseup.kuma-scroller", data, function(e) {
                self._onMouseUp.call(self, e);
            });
        },
        /**
         * @method private
         * @name _onMouseMove
         * @description Handles mousemove event
         * @param e [object] "Event data"
         */
        _onMouseMove: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var data = e.data, oe = e.originalEvent, pos = 0, delta = 0, touch = typeof oe.targetTouches !== "undefined" ? oe.targetTouches[0] : null;
            var pageX = touch ? touch.pageX : e.clientX, pageY = touch ? touch.pageY : e.clientY;
            if (data.horizontal) {
                // Horizontal
                delta = data.mouseStart - pageX;
                pos = data.handleLeft - delta;
            } else {
                // Vertical
                delta = data.mouseStart - pageY;
                pos = data.handleTop - delta;
            }
            this._position.apply(data.$scroller, [ data, pos ]);
        },
        /**
         * @method private
         * @name _onMouseUp
         * @description Handles mouseup event
         * @param e [object] "Event data"
         */
        _onMouseUp: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var data = e.data;
            data.$content.on("scroll.kuma-scroller", data, this._onScroll);
            this.get("$body").off(".kuma-scroller");
        },
        /**
         * @method private
         * @name _onTouchEnd
         * @description Handles mouseup event
         * @param e [object] "Event data"
         */
        _onTouchEnd: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var data = e.data;
            data.$content.on("scroll.kuma-scroller", data, this._onScroll);
            this.get("$body").off(".kuma-scroller");
        },
        /**
         * @method private
         * @name _position
         * @description Position handle based on scroll
         * @param data [object] "Instance data"
         * @param pos [int] "Scroll position"
         */
        _position: function(data, pos) {
            if (data.horizontal) {
                // Horizontal
                if (pos < data.handleBounds.left) {
                    pos = data.handleBounds.left;
                }
                if (pos > data.handleBounds.right) {
                    pos = data.handleBounds.right;
                }
                var scrollLeft = Math.round(pos * data.scrollRatio);
                data.$handle.css({
                    left: pos
                });
                data.$content.scrollLeft(scrollLeft);
            } else {
                // Vertical
                if (pos < data.handleBounds.top) {
                    pos = data.handleBounds.top;
                }
                if (pos > data.handleBounds.bottom) {
                    pos = data.handleBounds.bottom;
                }
                var scrollTop = Math.round(pos * data.scrollRatio);
                data.$handle.css({
                    top: pos
                });
                data.$content.scrollTop(scrollTop);
            }
        }
    });
    module.exports = Scroller;
});
