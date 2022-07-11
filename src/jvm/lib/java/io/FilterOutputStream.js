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
exports.FilterOutputStream = void 0;
var OutputStream_js_1 = require("./OutputStream.js");
var FilterOutputStream = /** @class */ (function (_super) {
    __extends(FilterOutputStream, _super);
    function FilterOutputStream() {
        return _super.call(this) || this;
    }
    FilterOutputStream.prototype.toString = function () {
        return "java.io.FilterOutputStream";
    };
    return FilterOutputStream;
}(OutputStream_js_1.OutputStream));
exports.FilterOutputStream = FilterOutputStream;
//# sourceMappingURL=FilterOutputStream.js.map