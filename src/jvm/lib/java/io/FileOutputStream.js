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
exports.FileOutputStream = void 0;
var types_1 = require("../../../core/cfl/types");
var OutputLogger_1 = require("../../../utils/OutputLogger");
var FileOutputStream = /** @class */ (function (_super) {
    __extends(FileOutputStream, _super);
    function FileOutputStream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileOutputStream._writeOut = function (thread, b, off, len) {
        var bytes = thread.runtimeDataArea.objectHeap[b.heapIndex];
        for (var i = off; i < off + len; i++) {
            var byte = bytes[i];
            OutputLogger_1.OutputLogger.write(String.fromCharCode(byte));
        }
    };
    FileOutputStream.writeBytes = function (thread, klass, obj, b, off, len, append) {
        var fileDescriptor = thread.runtimeDataArea.objectHeap[obj.heapIndex].filter(function (v) { return v.name === "fd"; })[0].value;
        var fd = thread.runtimeDataArea.objectHeap[fileDescriptor.heapIndex].filter(function (v) { return v.name === "handle"; })[0].value;
        if (fd == 1)
            this._writeOut(thread, b, off, len);
    };
    return FileOutputStream;
}(types_1.JavaObject));
exports.FileOutputStream = FileOutputStream;
//# sourceMappingURL=FileOutputStream.js.map