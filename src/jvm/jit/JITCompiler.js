"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JITCompiler = void 0;
var ConstantPoolInfo_1 = require("../models/info/ConstantPoolInfo");
var BootstrapClassLoader_1 = require("../core/BootstrapClassLoader");
var ClassFileLoader_1 = require("../core/cfl/ClassFileLoader");
var JITCompiler = /** @class */ (function () {
    function JITCompiler() {
    }
    JITCompiler.compile = function (thread, clazz, method) {
        var result = "";
        var stack = [];
        var codeAttributes = method.attributes.filter(function (attribute) { return (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(clazz.constantPool, attribute.attributeNameIndex) === "Code"; });
        if (!codeAttributes || codeAttributes.length == 0)
            return;
        var codeAttribute = codeAttributes[0];
        var codes = codeAttribute.code;
        codes.resetOffset();
        var code = 0;
        for (var i = 0; codes.offset < codes.getLength(); i++) {
            code = codes.getUint8();
            switch (code) {
                // ldc
                case 0x12: {
                    var info = (0, BootstrapClassLoader_1.getConstantPoolInfo)(clazz.constantPool, codes.getUint8()).info;
                    if (info.tag === ConstantPoolInfo_1.CONSTANT_STRING) {
                        stack.push({
                            expr: "\"".concat((0, ConstantPoolInfo_1.readUtf8FromConstantPool)(clazz.constantPool, info.stringIndex), "\"")
                        });
                        break;
                    }
                    break;
                }
                // return
                case 0xb1: {
                    result += "return;\n";
                    break;
                }
                // getstatic
                case 0xb2: {
                    var fieldRef = (0, BootstrapClassLoader_1.getConstantPoolInfo)(clazz.constantPool, (codes.getUint8() << 8) | codes.getUint8()).info;
                    var classRef = (0, BootstrapClassLoader_1.getConstantPoolInfo)(clazz.constantPool, fieldRef.classIndex).info;
                    var fieldNameAndTypeRef = (0, BootstrapClassLoader_1.getConstantPoolInfo)(clazz.constantPool, fieldRef.nameAndTypeIndex).info;
                    var className = (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(clazz.constantPool, classRef.nameIndex).split("/").join(".");
                    var fieldName = (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(clazz.constantPool, fieldNameAndTypeRef.nameIndex);
                    stack.push({
                        expr: className + "." + fieldName
                    });
                    break;
                }
                // invokevirtual
                case 0xb6: {
                    var methodRef = (0, BootstrapClassLoader_1.getConstantPoolInfo)(clazz.constantPool, (codes.getUint8() << 8) | codes.getUint8()).info;
                    var methodNameAndTypeRef = (0, BootstrapClassLoader_1.getConstantPoolInfo)(clazz.constantPool, methodRef.nameAndTypeIndex).info;
                    var klazz = (0, BootstrapClassLoader_1.getConstantPoolInfo)(clazz.constantPool, methodRef.classIndex).info;
                    var className = (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(clazz.constantPool, klazz.nameIndex).split("/").join(".");
                    var descriptor = (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(clazz.constantPool, methodNameAndTypeRef.descriptorIndex);
                    var invokeMethodName_1 = (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(clazz.constantPool, methodNameAndTypeRef.nameIndex);
                    var argumentsAndReturnType_1 = (0, ClassFileLoader_1.getArgumentsAndReturnType)(descriptor);
                    var args_1 = "";
                    for (var j = 0; j < argumentsAndReturnType_1[0].length; j++) {
                        args_1 += ", " + stack.pop().expr;
                    }
                    var name_1 = stack.pop().expr + "." + invokeMethodName_1;
                    if (this.aliases[name_1] != null)
                        name_1 = this.aliases[name_1];
                    result += "".concat(name_1, "(").concat(args_1.substring(2), ");\n");
                    break;
                }
            }
        }
        var argumentsAndReturnType = (0, ClassFileLoader_1.getArgumentsAndReturnType)((0, ConstantPoolInfo_1.readUtf8FromConstantPool)(clazz.constantPool, method.descriptorIndex));
        var invokeMethodName = (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(clazz.constantPool, method.nameIndex);
        var args = "";
        for (var i = 0; i < argumentsAndReturnType[0].length; i++) {
            args += ", _arg".concat(i);
        }
        return "function ".concat(clazz.name.split(".").join("_"), "_").concat(invokeMethodName, "(").concat(args.substring(2), ") {\n").concat(result, "}");
    };
    JITCompiler.aliases = {
        "java.lang.System.out.println": "console.log"
    };
    return JITCompiler;
}());
exports.JITCompiler = JITCompiler;
//# sourceMappingURL=JITCompiler.js.map