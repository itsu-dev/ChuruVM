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
exports.HTMLElement = void 0;
var Utils_1 = require("../../../../../utils/Utils");
var Element_1 = require("../Element");
var HTMLElement = /** @class */ (function (_super) {
    __extends(HTMLElement, _super);
    function HTMLElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLElement.getInnerText = function (thread, klazz, obj) {
        return obj.runtimeDataArea.createStringObject(thread, document.getElementById((0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(obj, "id"))).innerText);
    };
    HTMLElement.setInnerText = function (thread, klazz, obj, _innerText) {
        document.getElementById((0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(obj, "id"))).innerText = (0, Utils_1.getString)(obj.runtimeDataArea, _innerText);
    };
    HTMLElement.getValue = function (thread, klazz, obj) {
        return obj.runtimeDataArea.createStringObject(thread, document.getElementById((0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(obj, "id"))).value);
    };
    HTMLElement.setValue = function (thread, klazz, obj, _value) {
        document.getElementById((0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(obj, "id"))).value = (0, Utils_1.getString)(obj.runtimeDataArea, _value);
    };
    return HTMLElement;
}(Element_1.Element));
exports.HTMLElement = HTMLElement;
//# sourceMappingURL=HTMLElement.js.map