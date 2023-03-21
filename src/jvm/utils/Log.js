"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logClass = exports.logMethod = void 0;
var log = true;
var logMethod = function (tag, className, methodName) {
    if (log) {
        // logText(`[${tag}] ${className}#${methodName}`);
        console.log("[".concat(tag, "] ").concat(className, "#").concat(methodName));
    }
};
exports.logMethod = logMethod;
var logClass = function (tag, className) {
    if (log) {
        console.log("[".concat(tag, "] ").concat(className));
    }
};
exports.logClass = logClass;
var logText = function (text) {
    if (document.getElementById("out"))
        document.getElementById("out").value += "".concat(text, "\n");
};
//# sourceMappingURL=Log.js.map