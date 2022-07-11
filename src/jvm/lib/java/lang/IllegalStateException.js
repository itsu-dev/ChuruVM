"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalStateException = void 0;
var RuntimeException_js_1 = require("./RuntimeException.js");
var IllegalStateException = /** @class */ (function (_super) {
    __extends(IllegalStateException, _super);
    function IllegalStateException(message) {
        var _this = _super.call(this) || this;
        _this.message = message;
        return _this;
    }
    IllegalStateException.prototype.toString = function () {
        return "java.lang.IllegalStateException: ".concat(this.message);
    };
    return IllegalStateException;
}(RuntimeException_js_1.default));
exports.IllegalStateException = IllegalStateException;
//# sourceMappingURL=IllegalStateException.js.map