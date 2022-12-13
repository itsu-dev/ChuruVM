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
exports.Element = void 0;
var Utils_1 = require("../../../../utils/Utils");
var Node_1 = require("./Node");
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Element.insertAdjacentHTML = function (thread, klazz, obj, _position, _text) {
        document.getElementById((0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(obj, "id"))).insertAdjacentHTML((0, Utils_1.getString)(obj.runtimeDataArea, _position), (0, Utils_1.getString)(obj.runtimeDataArea, _text));
    };
    Element.remove = function (thread, klazz, obj) {
        document.getElementById((0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(obj, "id"))).remove();
    };
    return Element;
}(Node_1.Node));
exports.Element = Element;
//# sourceMappingURL=Element.js.map