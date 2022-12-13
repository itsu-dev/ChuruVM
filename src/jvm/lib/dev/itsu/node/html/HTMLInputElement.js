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
exports.HTMLInputElement = void 0;
var Utils_1 = require("../../../../../utils/Utils");
var HTMLElement_1 = require("./HTMLElement");
var HTMLInputElement = /** @class */ (function (_super) {
    __extends(HTMLInputElement, _super);
    function HTMLInputElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLInputElement.getValue = function (thread, klazz, obj) {
        return obj.runtimeDataArea.createStringObject(thread, document.getElementById((0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(obj, "id"))).value);
    };
    HTMLInputElement.setValue = function (thread, klazz, obj, _value) {
        document.getElementById((0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(obj, "id"))).value = (0, Utils_1.getString)(obj.runtimeDataArea, _value);
    };
    return HTMLInputElement;
}(HTMLElement_1.HTMLElement));
exports.HTMLInputElement = HTMLInputElement;
//# sourceMappingURL=HTMLInputElement.js.map