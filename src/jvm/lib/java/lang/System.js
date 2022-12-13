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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
var types_1 = require("../../../core/cfl/types");
var JavaClass_1 = __importDefault(require("../../../core/cfl/JavaClass"));
var ExceptionHandler_1 = require("../../../utils/ExceptionHandler");
var System = /** @class */ (function (_super) {
    __extends(System, _super);
    function System() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    System.registerNatives = function (thread, klass, obj) {
        // TODO
    };
    System.setIn0 = function (thread, klass, obj, inputStream) {
        klass.getDeclaredField("in").staticValue = inputStream;
    };
    System.setOut0 = function (thread, klass, obj, printStream) {
        klass.getDeclaredField("out").staticValue = printStream;
    };
    System.setErr0 = function (thread, klass, obj, printStream) {
        klass.getDeclaredField("err").staticValue = printStream;
    };
    System.initProperties = function (thread, klass, obj, properties) {
        // const lineSeparator = await createString(thread.runtimeDataArea, "line.separator");
        var fileEncodingKey = thread.runtimeDataArea.createStringObject(thread, "file.encoding");
        var fileEncodingValue = thread.runtimeDataArea.createStringObject(thread, "UTF-8");
        thread.invokeMethod("setProperty", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/Object;", properties.type, [fileEncodingValue, fileEncodingKey], properties);
        var lineSeparatorKey = thread.runtimeDataArea.createStringObject(thread, "line.separator");
        var lineSeparatorValue = thread.runtimeDataArea.createStringObject(thread, "\n");
        thread.invokeMethod("setProperty", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/Object;", properties.type, [lineSeparatorValue, lineSeparatorKey], properties);
        return properties;
    };
    System.arraycopy = function (thread, klass, obj, src, srcPos, dest, destPos, length) {
        if (src == null) {
            (0, ExceptionHandler_1.throwException)("java.lang.NullPointerException: src", thread.runtimeDataArea);
            return;
        }
        if (dest == null) {
            (0, ExceptionHandler_1.throwException)("java.lang.NullPointerException: dest", thread.runtimeDataArea);
            return;
        }
        if (!src.isArray || !dest.isArray
            || ((JavaClass_1.default.isWrappedPrimitive(src.type.name) && JavaClass_1.default.isWrappedPrimitive(dest.type.name)) && src.type.name !== src.type.name)) {
            (0, ExceptionHandler_1.throwException)("java.lang.ArrayStoreException", thread.runtimeDataArea);
            return;
        }
        var srcArray = thread.runtimeDataArea.objectHeap[src.heapIndex];
        var destArray = thread.runtimeDataArea.objectHeap[dest.heapIndex];
        if (srcPos < 0 || destPos < 0 || length < 0 || srcArray.length < srcPos + length || destArray.length < destPos + length) {
            (0, ExceptionHandler_1.throwException)("java.lang.IndexOutOfBoundsException", thread.runtimeDataArea);
            return;
        }
        for (var i = 0; i < length; i++) {
            destArray[destPos + i] = srcArray[srcPos + i];
        }
        return;
    };
    return System;
}(types_1.JavaObject));
exports.System = System;
//# sourceMappingURL=System.js.map