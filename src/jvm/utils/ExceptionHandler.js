"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwException = void 0;
var ConstantPoolInfo_1 = require("../models/info/ConstantPoolInfo");
var OutputLogger_1 = require("./OutputLogger");
var throwException = function (name, runtimeDataArea) {
    console.error(name);
    // (document.getElementById("out") as HTMLDivElement).innerHTML += `<span style='color: red;'>${name}<br /></span>`;
    OutputLogger_1.OutputLogger.error(name);
    var count = 0;
    runtimeDataArea.getCurrentThread().stack.reverse().forEach(function (frame, index) {
        if (19 < count) {
            OutputLogger_1.OutputLogger.error("&nbsp;&nbsp;&nbsp;&nbsp;...".concat(runtimeDataArea.getCurrentThread().stack.length - index + 1, " more"));
            console.error("    ...".concat(runtimeDataArea.getCurrentThread().stack.length - index + 1, " more"));
            return;
        }
        var codeAttribute = frame.method.attributes.filter(function (value) { return (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(frame.constantPool, value.attributeNameIndex) === "Code"; })[0];
        var lineNumberAttribute = codeAttribute.attributes.filter(function (value) { return (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(frame.constantPool, value.attributeNameIndex) === "LineNumberTable"; })[0];
        var lineNumberTable = null;
        if (!(frame.opcode == null)) {
            lineNumberTable = lineNumberAttribute.lineNumberTable.filter(function (value, index, array) {
                if (index + 1 < array.length) {
                    return value.startPc <= frame.opcode.id && frame.opcode.id < array[index + 1].startPc;
                }
                else {
                    return value.startPc <= frame.opcode.id;
                }
            })[0];
        }
        var text = lineNumberTable == null ? "".concat(frame.javaClass.getSimpleName(), ".java:Unknown Source") : "".concat(frame.javaClass.getSimpleName(), ".java:").concat(lineNumberTable.lineNumber);
        // (document.getElementById("out") as HTMLDivElement).innerHTML += `<span style='color: red;'>&nbsp;&nbsp;&nbsp;&nbsp;at ${frame.javaClass.name}.${readUtf8FromConstantPool(frame.constantPool, frame.method.nameIndex)}(${text})<br /></span>`;
        OutputLogger_1.OutputLogger.error("&nbsp;&nbsp;&nbsp;&nbsp;at ".concat(frame.javaClass.name, ".").concat((0, ConstantPoolInfo_1.readUtf8FromConstantPool)(frame.constantPool, frame.method.nameIndex), "(").concat(text, ")"));
        console.error("    at ".concat(frame.javaClass.name, ".").concat((0, ConstantPoolInfo_1.readUtf8FromConstantPool)(frame.constantPool, frame.method.nameIndex), "(").concat(text, ")"));
        count++;
    });
    throw new Error(name);
};
exports.throwException = throwException;
//# sourceMappingURL=ExceptionHandler.js.map