/**
 * Created by Administrator on 2017-05-22.
 */
define("alinw/transfer/1.0.0/transfer-debug", [ "./transfer-debug.css", "$-debug", "widget-debug", "./transfer-debug.handlebars" ], function(require, exports, module) {
    require("./transfer-debug.css");
    var $ = require("$-debug");
    var Widget = require("widget-debug");
    var i18n = {
        "zh-cn": {
            unselected: "未选择",
            selected: "已选择"
        },
        en: {
            unselected: "Unselected",
            selected: "Selected"
        }
    };
    var tpl = require("./transfer-debug.handlebars");
    var Transfer = Widget.extend({
        attrs: {
            locale: "zh-cn",
            model: [],
            autoFocus: false
        },
        events: {
            "click .J_Transfer": "onTransfer",
            "keydown .J_Transfer": "onTransfer",
            "click .J_Item": "onChoose",
            "keydown .J_Item": "onChoose"
        },
        setup: function() {
            var me = this;
            me.render();
            if (me.get("autoFocus")) {
                setTimeout(function() {
                    me.$(".J_Item").eq(0).focus();
                }, 0);
            }
        },
        _onRenderModel: function(model) {
            var me = this;
            var locale = me.get("locale");
            if (typeof locale === "string") {
                locale = i18n[me.get("locale")];
            }
            me.element.html(tpl({
                i18n: locale || {},
                data: model
            }));
        },
        _transfer: function(direction) {
            var me = this;
            var model = me.get("model") || [];
            if (direction === "left") {
                me.$(".J_Right").find(".selected").each(function() {
                    model[$(this).data("index")].choose = false;
                });
                setTimeout(function() {
                    me.$(".J_Left").find(".J_Item").eq(0).focus();
                }, 0);
            } else {
                me.$(".J_Left").find(".selected").each(function() {
                    model[$(this).data("index")].choose = true;
                });
                setTimeout(function() {
                    me.$(".J_Right").find(".J_Item").eq(0).focus();
                }, 0);
            }
            me.set("model", (me.get("model") || []).slice(0));
        },
        getSelected: function() {
            var me = this;
            return $.grep(me.get("model") || [], function(n) {
                return n.choose;
            });
        },
        onChoose: function(evt) {
            var me = this;
            var target = $(evt.currentTarget);
            var jLeft = me.$(".J_Left");
            var jRight = me.$(".J_Right");
            var jTransfer = me.$(".J_Transfer");
            if (evt.type === "click" || evt.keyCode === 32) {
                target.toggleClass("selected");
                jTransfer.removeClass("enable");
                if (jLeft.find(".selected").size()) {
                    jTransfer.eq(1).addClass("enable");
                }
                if (jRight.find(".selected").size()) {
                    jTransfer.eq(0).addClass("enable");
                }
            } else if (evt.keyCode === 37) {
                // left
                if (jRight.find(".selected").size()) {
                    me._transfer("left");
                } else {
                    jLeft.find(".J_Item").eq(0).focus();
                }
            } else if (evt.keyCode === 38) {
                // up
                target.parent().prev().children().focus();
            } else if (evt.keyCode === 39) {
                // right
                if (jLeft.find(".selected").size()) {
                    me._transfer("right");
                } else {
                    jRight.find(".J_Item").eq(0).focus();
                }
            } else if (evt.keyCode === 40) {
                // down
                target.parent().next().children().focus();
            }
            if (evt.keyCode === 32 || evt.keyCode === 37 || evt.keyCode === 38 || evt.keyCode === 39 || evt.keyCode === 40) {
                evt.preventDefault();
            }
        },
        onTransfer: function(evt) {
            var me = this;
            var target = $(evt.currentTarget);
            var direction = target.data("direction");
            if (evt.type === "click" || evt.keyCode === 32) {
                if (target.hasClass("enable")) {
                    me._transfer(direction);
                    if (evt.keyCode) {
                        evt.preventDefault();
                    }
                }
            }
        }
    });
    module.exports = Transfer;
});

define("alinw/transfer/1.0.0/transfer-debug.css", [], function() {
    seajs.importStyle(".kuma-transfer-container{font-size:12px}.kuma-transfer-container th{line-height:30px}.kuma-transfer-container td{padding:0;vertical-align:top}.kuma-transfer-block{width:300px;height:300px;padding:5px 10px;border:1px solid #d7d7d7;border-radius:2px;background-color:#fff;overflow-x:hidden;overflow-y:auto}.kuma-transfer-block a{display:block;width:280px;height:30px;padding:0 10px;overflow:hidden;line-height:30px;color:#999}.kuma-transfer-block a:hover,.kuma-transfer-block a:focus{outline:0;background-color:#f7f7f7;text-decoration:none}.kuma-transfer-block a.selected{position:relative;background-color:#f90;color:#fff}.kuma-transfer-block a.selected:before{content:\"\\e601\";display:block;position:absolute;right:10px;top:1px;font-family:kuma!important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-stroke-width:.2px;-moz-osx-font-smoothing:grayscale}.kuma-transfer-container .kuma-transfer-buttons{width:90px;text-align:center;vertical-align:middle;line-height:0}.kuma-transfer-buttons>a{position:relative;display:inline-block;width:30px;height:30px;border:1px solid #d3d3d3;background-color:#fff;margin-bottom:15px}.kuma-transfer-buttons>a.enable{background-color:#f90;border-color:transparent #f80}.kuma-transfer-buttons>a:before{content:' ';display:block;position:absolute;top:9px;left:11px;width:0;height:0;border-style:solid;border-width:6px 0 6px 10px;border-color:transparent #999}.kuma-transfer-buttons>a:first-child:before{left:10px;border-width:6px 10px 6px 0}.kuma-transfer-buttons .enable:before{border-color:transparent #fff}");
});

define("alinw/transfer/1.0.0/transfer-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n                        ";
            stack1 = helpers.unless.call(depth0, depth0.choose, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n                    ";
            return buffer;
        }
        function program2(depth0, data) {
            var buffer = "", stack1, stack2;
            buffer += '\n                            <li>\n                                <a href="javascript:;" title="';
            if (stack1 = helpers.description) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.description;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" class="J_Item" data-index="' + escapeExpression((stack1 = data.index,
                    typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">\n                                    ';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "\n                                </a>\n                            </li>\n                        ";
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n                        ";
            stack1 = helpers["if"].call(depth0, depth0.choose, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n                    ";
            return buffer;
        }
        buffer += '<table class="kuma-transfer-container">\n    <thead>\n        <tr>\n            <th>' + escapeExpression((stack1 = (stack1 = depth0.i18n,
                stack1 == null || stack1 === false ? stack1 : stack1.unselected), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</th>\n            <th>&nbsp;</th>\n            <th>" + escapeExpression((stack1 = (stack1 = depth0.i18n,
                stack1 == null || stack1 === false ? stack1 : stack1.selected), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <td>\n                <ul class="J_Left kuma-transfer-block">\n                    ';
        stack2 = helpers.each.call(depth0, depth0.data, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '\n                </ul>\n            </td>\n            <td class="kuma-transfer-buttons">\n                <a href="javascript:;" class="J_Transfer" data-direction="left"></a><br><a href="javascript:;" class="J_Transfer" data-direction="right"></a>\n            </td>\n            <td>\n                <ul class="J_Right kuma-transfer-block">\n                    ';
        stack2 = helpers.each.call(depth0, depth0.data, {
            hash: {},
            inverse: self.noop,
            fn: self.program(4, program4, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "\n                </ul>\n            </td>\n        </tr>\n    </tbody>\n</table>";
        return buffer;
    });
});
