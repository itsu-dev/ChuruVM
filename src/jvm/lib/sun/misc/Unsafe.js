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
exports.Unsafe = void 0;
var JavaObject_1 = require("../../java/lang/JavaObject");
var Utils_1 = require("../../../utils/Utils");
var BootstrapClassLoader_1 = __importDefault(require("../../../core/BootstrapClassLoader"));
var Unsafe = /** @class */ (function (_super) {
    __extends(Unsafe, _super);
    function Unsafe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Unsafe.registerNatives = function (thread, klass, obj) {
    };
    Unsafe.arrayBaseOffset = function (thread, klass, obj, clazz) {
        return 0;
    };
    Unsafe.arrayIndexScale = function (thread, klass, obj, clazz) {
        return 0;
    };
    Unsafe.addressSize = function (thread, klass, obj) {
        return 4;
    };
    Unsafe.isBigEndian0 = function (thread, klass, obj) {
        return 1;
    };
    Unsafe.unalignedAccess0 = function (thread, klass, obj) {
        return 0;
    };
    Unsafe.allocateMemory = function (thread, klass, obj, size) {
        return thread.runtimeDataArea.allocate(size);
    };
    Unsafe.freeMemory = function (thread, klass, obj, ptr) {
        thread.runtimeDataArea.objectHeap[ptr] = null;
    };
    Unsafe.putLong = function (thread, klass, obj, ptr, x) {
        var array = new ArrayBuffer(8);
        var view = new DataView(array);
        view.setBigUint64(0, x, false);
        return thread.runtimeDataArea.objectHeap[ptr] = Array.from(new Uint8Array(array));
    };
    Unsafe.getByte = function (thread, klass, obj, ptr) {
        return thread.runtimeDataArea.objectHeap[ptr][0];
    };
    Unsafe.objectFieldOffset = function (thread, klass, obj, _field) {
        var declaringClassName = (0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)((0, Utils_1.getFieldValue)(_field, "clazz"), "name"));
        var declaringClass = BootstrapClassLoader_1.default.getInstance().findClass(declaringClassName);
        var name = (0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(_field, "name"));
        var index = 0;
        for (var _i = 0, _a = declaringClass.getDeclaredFields(); _i < _a.length; _i++) {
            var declaredField = _a[_i];
            if (declaredField.name == name) {
                return index;
            }
            index++;
        }
        return -1;
    };
    Unsafe.compareAndSwapObject = function (thread, klass, obj, _o, _offset, _expected, _x) {
        var variable = thread.runtimeDataArea.objectHeap[_o.heapIndex].filter(function (v) { return v.name === _o.type.getDeclaredFields()[_offset].name; })[0];
        var hash1 = 0;
        if (variable.value != null)
            hash1 = JavaObject_1.JavaObject.hashCode(thread, BootstrapClassLoader_1.default.getInstance().findClass(variable.typeName.substring(1)), variable.value);
        var hash2 = 0;
        if (_expected != null)
            hash2 = JavaObject_1.JavaObject.hashCode(thread, _expected.type, _expected);
        if (hash1 == hash2) {
            variable.value = _x;
            return true;
        }
        return false;
    };
    Unsafe.compareAndSwapInt = function (thread, klass, obj, _o, _offset, _expected, _x) {
        var variable = thread.runtimeDataArea.objectHeap[_o.heapIndex].filter(function (v) { return v.name === _o.type.getDeclaredFields()[_offset].name; })[0];
        if (variable.value == _expected) {
            variable.value = _x;
            return true;
        }
        return false;
    };
    Unsafe.getObjectVolatile = function (thread, klass, obj, _o, _offset) {
        return thread.runtimeDataArea.objectHeap[_o.heapIndex]
            .filter(function (v) { return v.name === _o.type.getDeclaredFields()[_offset].name; })[0]
            .value;
    };
    return Unsafe;
}(JavaObject_1.JavaObject));
exports.Unsafe = Unsafe;
//# sourceMappingURL=Unsafe.js.map