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
exports.Thread = void 0;
var types_1 = require("../../../core/cfl/types");
var Thread = /** @class */ (function (_super) {
    __extends(Thread, _super);
    function Thread() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Thread.init = function (thread) {
        if (this.current == null) {
            var threadGroup = thread.runtimeDataArea.createObject("java.lang.ThreadGroup");
            thread.invokeMethod("<init>", "()V", threadGroup.type, [], threadGroup);
            var currentThread = thread.runtimeDataArea.createObject("java.lang.Thread");
            var variables = thread.runtimeDataArea.objectHeap[currentThread.heapIndex];
            variables.filter(function (v) { return v.name == "group"; })[0].value = threadGroup;
            variables.filter(function (v) { return v.name == "name"; })[0].value = thread.runtimeDataArea.createStringObject(thread, "main");
            variables.filter(function (v) { return v.name == "priority"; })[0].value = 5;
            this.current = currentThread;
        }
    };
    Thread.registerNatives = function (thread, klass, obj) {
        // klass.getDeclaredField("in").staticValue = inputStream;
    };
    Thread.currentThread = function (thread, klass, obj) {
        if (this.current == null) {
            var threadGroup = thread.runtimeDataArea.createObject("java.lang.ThreadGroup");
            thread.invokeMethod("<init>", "()V", threadGroup.type, [], threadGroup);
            var currentThread = thread.runtimeDataArea.createObject("java.lang.Thread");
            var variables = thread.runtimeDataArea.objectHeap[currentThread.heapIndex];
            variables.filter(function (v) { return v.name == "group"; })[0].value = threadGroup;
            variables.filter(function (v) { return v.name == "name"; })[0].value = thread.runtimeDataArea.createStringObject(thread, "main");
            variables.filter(function (v) { return v.name == "priority"; })[0].value = 5;
            this.current = currentThread;
        }
        return this.current;
    };
    Thread.current = null;
    return Thread;
}(types_1.JavaObject));
exports.Thread = Thread;
//# sourceMappingURL=Thread.js.map