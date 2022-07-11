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
exports.NoSuchFieldError = void 0;
var LinkageError_js_1 = require("./LinkageError.js");
var NoSuchFieldError = /** @class */ (function (_super) {
    __extends(NoSuchFieldError, _super);
    function NoSuchFieldError(message) {
        var _this = _super.call(this) || this;
        _this.message = message;
        return _this;
    }
    NoSuchFieldError.prototype.toString = function () {
        return "java.lang.NoSuchFieldError: ".concat(this.message);
    };
    return NoSuchFieldError;
}(LinkageError_js_1.LinkageError));
exports.NoSuchFieldError = NoSuchFieldError;
//# sourceMappingURL=NoSuchFieldError.js.map