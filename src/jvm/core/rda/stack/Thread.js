"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var Frame_js_1 = require("./Frame.js");
var ConstantPoolInfo_js_1 = require("../../../models/info/ConstantPoolInfo.js");
var ClassFileLoader_js_1 = require("../../cfl/ClassFileLoader.js");
var Log_1 = require("../../../utils/Log");
var ExceptionHandler_1 = require("../../../utils/ExceptionHandler");
var Thread = /** @class */ (function () {
    function Thread(runtimeDataArea, stackSize, id) {
        var _this = this;
        this.invokingNative = false;
        this.findMethod = function (methodName, descriptor, klass) {
            var method = klass.methodInfos.filter(function (value) {
                return (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(klass.constantPool, value.nameIndex) === methodName
                    && ((descriptor === "") || descriptor === (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(klass.constantPool, value.descriptorIndex));
            })[0];
            if (method == null) {
                if (klass.superClass != null) {
                    return _this.findMethod(methodName, descriptor, klass.superClass);
                }
                else {
                    return [null, null];
                }
            }
            else {
                return [method, klass];
            }
        };
        if (stackSize < 1) {
            console.log("StackSize must must be bigger than 1.");
            return;
        }
        this.runtimeDataArea = runtimeDataArea;
        this.stackSize = stackSize;
        this.stack = [];
        this.id = id;
    }
    Thread.prototype.invokeMethod = function (methodName, descriptor, javaClass, args, javaObject) {
        if (javaObject === void 0) { javaObject = null; }
        var _a = this.findMethod(methodName, descriptor, javaClass), method = _a[0], klass = _a[1];
        if (method == null) {
            (0, ExceptionHandler_1.throwException)("java.lang.NoSuchMethodError: " + javaClass.name + "." + methodName, this.runtimeDataArea);
            return;
        }
        // method is native
        if (method.accessFlags & 256) {
            return this.invokeNative(methodName, method, javaClass, args, javaObject);
        }
        var codeAttributes = method.attributes.filter(function (attribute) { return (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(klass.constantPool, attribute.attributeNameIndex) === "Code"; });
        if (!codeAttributes || codeAttributes.length == 0) {
            return;
        }
        var codeAttribute = codeAttributes[0];
        var code = codeAttribute.code;
        code.resetOffset();
        var argsCount = (0, ClassFileLoader_js_1.getArgumentsAndReturnType)((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(klass.constantPool, method.descriptorIndex))[0].length;
        var frame = new Frame_js_1.Frame(this, this.runtimeDataArea, method, klass, codeAttribute.maxLocals - argsCount, klass.constantPool, args, javaObject);
        this.runtimeDataArea.incrementPCRegister(this.id);
        this.stack.push(frame);
        if (this.stack.length > this.stackSize) {
            (0, ExceptionHandler_1.throwException)("java.lang.StackOverFlowError", this.runtimeDataArea);
            return;
        }
        (0, Log_1.logMethod)("CALL", klass.name, (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(klass.constantPool, method.nameIndex));
        /*
        if (methodName == "isMethodHandleInvokeName") {
            throwException("java.lang.RuntimeException", this.runtimeDataArea);
            return ;
        }

         */
        frame.loadOpcodes();
        /*
        if (methodName === "main") {
            console.log(JITCompiler.compile(this, klass, method));
        }

         */
        var result = frame.execute();
        this.stack.pop();
        return result;
    };
    Thread.prototype.invokeNative = function (methodName, method, javaClass, args, javaObject) {
        var _a;
        if (javaObject === void 0) { javaObject = null; }
        this.invokingNative = true;
        (0, Log_1.logMethod)("NATIVECALL", javaClass.name, methodName);
        var module = this.runtimeDataArea.nativeModules[javaClass.name]; // await import("../../../lib/" + javaClass.name.split(".").join("/") + ".js");
        // TODO
        if (methodName === "getClass") {
            return this.runtimeDataArea.nativeModules["java.lang.Object"]["JavaObject"]["getClass"](this, javaClass, javaObject);
        }
        else if (methodName === "hashCode") {
            return this.runtimeDataArea.nativeModules["java.lang.Object"]["JavaObject"]["hashCode"](this, javaClass, javaObject);
        }
        else if (methodName === "notifyAll") {
            return this.runtimeDataArea.nativeModules["java.lang.Object"]["JavaObject"]["notifyAll"](this, javaClass, javaObject);
        }
        if (module == null) {
            (0, ExceptionHandler_1.throwException)("java.lang.ClassNotFoundException: " + javaClass.name, this.runtimeDataArea);
            return;
        }
        if (module[javaClass.getSimpleName()][methodName] == null) {
            (0, ExceptionHandler_1.throwException)("java.lang.NoSuchMethodError: " + javaClass.name + "." + methodName, this.runtimeDataArea);
            return;
        }
        return (_a = module[javaClass.getSimpleName()])[methodName].apply(_a, __spreadArray([this, javaClass, javaObject], args.reverse(), false));
    };
    return Thread;
}());
exports.default = Thread;
//# sourceMappingURL=Thread.js.map