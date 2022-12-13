"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readUtf8FromConstantPool = exports.isConstantDoubleInfo = exports.isConstantLongInfo = exports.isConstantStringInfo = exports.isConstantFieldRefInfo = exports.CONSTANT_INVOKE_DYNAMIC = exports.CONSTANT_METHOD_TYPE = exports.CONSTANT_METHOD_HANDLE = exports.CONSTANT_UTF8 = exports.CONSTANT_NAME_AND_TYPE = exports.CONSTANT_DOUBLE = exports.CONSTANT_LONG = exports.CONSTANT_FLOAT = exports.CONSTANT_INTEGER = exports.CONSTANT_STRING = exports.CONSTANT_INTERFACE_METHOD_REF = exports.CONSTANT_METHOD_REF = exports.CONSTANT_FIELD_REF = exports.CONSTANT_CLASS = void 0;
var ClassFileLoader_js_1 = require("../../core/cfl/ClassFileLoader.js");
exports.CONSTANT_CLASS = 7;
exports.CONSTANT_FIELD_REF = 9;
exports.CONSTANT_METHOD_REF = 10;
exports.CONSTANT_INTERFACE_METHOD_REF = 11;
exports.CONSTANT_STRING = 8;
exports.CONSTANT_INTEGER = 3;
exports.CONSTANT_FLOAT = 4;
exports.CONSTANT_LONG = 5;
exports.CONSTANT_DOUBLE = 6;
exports.CONSTANT_NAME_AND_TYPE = 12;
exports.CONSTANT_UTF8 = 1;
exports.CONSTANT_METHOD_HANDLE = 15;
exports.CONSTANT_METHOD_TYPE = 16;
exports.CONSTANT_INVOKE_DYNAMIC = 18;
var isConstantFieldRefInfo = function (arg) {
    return typeof arg === "object" &&
        arg !== null &&
        typeof arg.tag === "number" &&
        typeof arg.classIndex === "number" &&
        typeof arg.nameAndTypeIndex === "number";
};
exports.isConstantFieldRefInfo = isConstantFieldRefInfo;
var isConstantStringInfo = function (arg) {
    return typeof arg === "object" &&
        arg !== null &&
        typeof arg.tag === "number" &&
        typeof arg.stringIndex === "number";
};
exports.isConstantStringInfo = isConstantStringInfo;
var isConstantLongInfo = function (arg) {
    return typeof arg === "object" &&
        arg !== null &&
        typeof arg.tag === "number" &&
        typeof arg.highBytes === "number" &&
        typeof arg.lowBytes === "number";
};
exports.isConstantLongInfo = isConstantLongInfo;
var isConstantDoubleInfo = function (arg) {
    return typeof arg === "object" &&
        arg !== null &&
        typeof arg.tag === "number" &&
        typeof arg.highBytes === "number" &&
        typeof arg.lowBytes === "number";
};
exports.isConstantDoubleInfo = isConstantDoubleInfo;
var readUtf8FromConstantPool = function (constantPool, index) {
    return new TextDecoder("utf-8").decode((0, ClassFileLoader_js_1.getConstantPoolInfo)(constantPool, index).info.bytes.view);
};
exports.readUtf8FromConstantPool = readUtf8FromConstantPool;
//# sourceMappingURL=ConstantPoolInfo.js.map