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
exports.Document = void 0;
var types_1 = require("../../../core/cfl/types");
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Document.getDefault = function (thread, klazz, obj) {
        if (this.doc == null) {
            this.doc = thread.runtimeDataArea.createObject("dev.itsu.Document");
        }
        return this.doc;
    };
    Document.getElementById = function (thread, klazz, obj, _id) {
        var elem = thread.runtimeDataArea.createObject("dev.itsu.node.html.HTMLElement");
        thread.runtimeDataArea.objectHeap[elem.heapIndex].filter(function (value) { return value.name == "id"; })[0].value = _id;
        return elem;
    };
    Document.doc = null;
    return Document;
}(types_1.JavaObject));
exports.Document = Document;
//# sourceMappingURL=Document.js.map