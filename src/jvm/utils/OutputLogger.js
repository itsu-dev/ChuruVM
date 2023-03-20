"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputLogger = void 0;
var OutputLogger = /** @class */ (function () {
    function OutputLogger() {
    }
    OutputLogger.setLogger = function (logger) {
        this.logger = logger;
    };
    OutputLogger.write = function (char) {
        this.logger.write(char);
    };
    OutputLogger.log = function (text) {
        this.logger.log(text);
    };
    OutputLogger.error = function (text) {
        this.logger.error(text);
    };
    OutputLogger.logger = new /** @class */ (function () {
        function class_1() {
        }
        class_1.prototype.log = function (text) {
            if (document.getElementById("out"))
                document.getElementById("out").innerHTML += "<span>".concat(text.replace(/</g, "&lt;").replace(/>/g, "&gt;"), "<br /></span>");
        };
        class_1.prototype.write = function (char) {
            if (char !== "\n") {
                if (document.getElementById("out"))
                    document.getElementById("out").innerHTML += "<span>".concat(char.replace(/</g, "&lt;").replace(/>/g, "&gt;"), "</span>");
            }
            else {
                if (document.getElementById("out"))
                    document.getElementById("out").innerHTML += "<br />";
            }
        };
        class_1.prototype.error = function (text) {
            if (document.getElementById("out"))
                document.getElementById("out").innerHTML += "<span style='color: red;'>".concat(text.replace(/</g, "&lt;").replace(/>/g, "&gt;"), "<br /></span>");
        };
        return class_1;
    }());
    return OutputLogger;
}());
exports.OutputLogger = OutputLogger;
//# sourceMappingURL=OutputLogger.js.map