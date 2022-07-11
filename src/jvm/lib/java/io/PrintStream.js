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
exports.PrintStream = void 0;
var FilterOutputStream_js_1 = require("./FilterOutputStream.js");
var OutputStream_js_1 = require("./OutputStream.js");
var PrintStream = /** @class */ (function (_super) {
    __extends(PrintStream, _super);
    function PrintStream(o) {
        var _this = _super.call(this) || this;
        _this.out = new OutputStream_js_1.OutputStream();
        if (!o)
            _this.out = o;
        return _this;
    }
    PrintStream.prototype.print = function (arg) {
        this.write(new TextEncoder().encode(String(arg == null ? "null" : arg)));
    };
    PrintStream.prototype.println = function (arg) {
        this.write(new TextEncoder().encode(String(arg == null ? "null" : arg) + "\n"));
    };
    PrintStream.prototype.toString = function () {
        return "java.io.PrintStream";
    };
    return PrintStream;
}(FilterOutputStream_js_1.FilterOutputStream));
exports.PrintStream = PrintStream;
//# sourceMappingURL=PrintStream.js.map