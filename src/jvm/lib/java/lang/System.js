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
exports.System = void 0;
var JavaObject_js_1 = require("./JavaObject.js");
var PrintStream_js_1 = require("../io/PrintStream.js");
var System = /** @class */ (function (_super) {
    __extends(System, _super);
    function System() {
        return _super.call(this) || this;
    }
    System.prototype.toString = function () {
        return "java.lang.System";
    };
    System.out = new PrintStream_js_1.PrintStream();
    System.err = new PrintStream_js_1.PrintStream();
    return System;
}(JavaObject_js_1.JavaObject));
exports.System = System;
//# sourceMappingURL=System.js.map