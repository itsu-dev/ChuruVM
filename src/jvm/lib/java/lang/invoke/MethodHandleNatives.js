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
exports.MethodHandleNatives = void 0;
var JavaObject_1 = require("../JavaObject");
var MethodHandleNatives = /** @class */ (function (_super) {
    __extends(MethodHandleNatives, _super);
    function MethodHandleNatives() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MethodHandleNatives.registerNatives = function (thread, klazz, obj) {
        return;
    };
    MethodHandleNatives.resolve = function (thread, klazz, obj, _self, _caller) {
        return _self;
    };
    MethodHandleNatives.getConstant = function (thread, klazz, obj, _which) {
        // TODO
        return 1;
    };
    return MethodHandleNatives;
}(JavaObject_1.JavaObject));
exports.MethodHandleNatives = MethodHandleNatives;
//# sourceMappingURL=MethodHandleNatives.js.map