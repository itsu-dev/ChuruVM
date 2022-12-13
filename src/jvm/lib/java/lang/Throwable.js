"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throwable = void 0;
var Throwable = /** @class */ (function () {
    function Throwable(message) {
        this.message = message ? message : ".js";
    }
    Throwable.prototype.printStackTrace = function () {
        console.error(toString());
    };
    Throwable.prototype.toString = function () {
        return "java.lang.Throwable: ".concat(this.message);
    };
    return Throwable;
}());
exports.Throwable = Throwable;
//# sourceMappingURL=Throwable.js.map