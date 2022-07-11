"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Frame_js_1 = require("./Frame.js");
var ConstantPoolInfo_js_1 = require("../../../models/info/ConstantPoolInfo.js");
var System_js_1 = require("../../../lib/java/lang/System.js");
var ClassFileLoader_js_1 = require("../../cfl/ClassFileLoader.js");
var Thread = /** @class */ (function () {
    function Thread(runtimeDataArea, stackSize, id) {
        if (stackSize < 1) {
            System_js_1.System.err.println("StackSize must must be bigger than 1.");
            return;
        }
        this.runtimeDataArea = runtimeDataArea;
        this.stackSize = stackSize;
        this.stack = [];
        this.id = id;
    }
    Thread.prototype.invokeMethod = function (methodName, classFile, args) {
        var constantPool = classFile.constantPool;
        var method = classFile.methods.filter(function (value) { return (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(constantPool, value.nameIndex) === methodName; })[0];
        var codeAttributes = method.attributes.filter(function (attribute) { return (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(constantPool, attribute.attributeNameIndex) === "Code"; });
        if (!codeAttributes || codeAttributes.length == 0)
            return;
        var codeAttribute = codeAttributes[0];
        var code = codeAttribute.code;
        code.resetOffset();
        var argsCount = (0, ClassFileLoader_js_1.getArgumentsAndReturnType)((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(constantPool, method.descriptorIndex))[0].length;
        var frame = new Frame_js_1.Frame(this, method, classFile, codeAttribute.maxLocals - argsCount, constantPool, args);
        this.runtimeDataArea.incrementPCRegister(this.id);
        this.stack.push(frame);
        if (this.stack.length > this.stackSize) {
            System_js_1.System.err.println("StackOverflowError!");
            return;
        }
        frame.loadOpcodes();
        frame.execute();
    };
    return Thread;
}());
exports.default = Thread;
//# sourceMappingURL=Thread.js.map