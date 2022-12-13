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
exports.Runtime = void 0;
var JavaObject_1 = require("../lang/JavaObject");
var Runtime = /** @class */ (function (_super) {
    __extends(Runtime, _super);
    function Runtime() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Runtime.availableProcessors = function (thread, klass, obj) {
        return window.navigator.hardwareConcurrency;
    };
    return Runtime;
}(JavaObject_1.JavaObject));
exports.Runtime = Runtime;
//# sourceMappingURL=Runtime.js.map