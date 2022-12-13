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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = exports.Executable = exports.Field = exports.Member = void 0;
var ConstantPoolInfo_1 = require("../../models/info/ConstantPoolInfo");
var ClassFile_1 = __importDefault(require("./ClassFile"));
var BootstrapClassLoader_1 = __importStar(require("../BootstrapClassLoader"));
var JavaClass = /** @class */ (function (_super) {
    __extends(JavaClass, _super);
    function JavaClass(name) {
        var _this = _super.call(this) || this;
        _this.declaredFields = [];
        _this.declaredMethods = [];
        _this.superClass = null;
        _this.initializedStatic = false;
        _this.classObject = null;
        _this.name = name;
        return _this;
    }
    JavaClass.prototype.init = function () {
        var _this = this;
        if (this.initialized)
            return;
        // initialize fields
        this.fieldInfos.forEach(function (value) { return _this.declaredFields.push(new Field(_this, value)); });
        // initialize methods
        this.methodInfos.forEach(function (value) { return _this.declaredMethods.push(new Method(_this, value)); });
        // set superclass recursively
        this.setSuperClass(this.superClassIndex);
        this.initialized = true;
    };
    JavaClass.prototype.initStatic = function (thread) {
        if (!this.initializedStatic && this.getDeclaredMethod("<clinit>") !== null) {
            this.initializedStatic = true;
            thread.invokeMethod("<clinit>", "()V", this, [], null);
        }
    };
    JavaClass.prototype.setSuperClass = function (superClassIndex) {
        // if this class is java.lang.Object
        if (superClassIndex == 0) {
            this.superClass = null;
            return;
        }
        var name = (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(this.constantPool, this.constantPool.filter(function (value) { return value.id == superClassIndex; })[0].info.nameIndex).split("/").join(".");
        this.superClass = BootstrapClassLoader_1.default.getInstance().findClass(name);
    };
    JavaClass.prototype.getSimpleName = function () {
        return this.name.split(".").reverse()[0];
    };
    JavaClass.prototype.getDeclaredField = function (name) {
        var _a;
        return (_a = this.declaredFields.filter(function (value) { return value.name == name; })) === null || _a === void 0 ? void 0 : _a[0];
    };
    JavaClass.prototype.getDeclaredFields = function () {
        return this.declaredFields;
    };
    JavaClass.prototype.getFields = function () {
        var result = [];
        var addSuperClassFields = function (javaClass) {
            if (javaClass.superClass !== null) {
                result.push.apply(result, javaClass.declaredFields);
                addSuperClassFields(javaClass.superClass);
            }
            return javaClass.declaredFields;
        };
        addSuperClassFields(this);
        return result;
    };
    JavaClass.prototype.getDeclaredMethod = function (name) {
        var _a;
        return (_a = this.declaredMethods.filter(function (value) { return value.name == name; })) === null || _a === void 0 ? void 0 : _a[0];
    };
    JavaClass.prototype.getMethods = function () {
        var result = [];
        var addSuperClassMethods = function (javaClass) {
            if (javaClass.superClass !== null) {
                result.push.apply(result, javaClass.declaredMethods);
                addSuperClassMethods(javaClass.superClass);
            }
            return javaClass.declaredMethods;
        };
        addSuperClassMethods(this);
        return result;
    };
    JavaClass.prototype.setClassObject = function (obj) {
        if (this.classObject == null)
            this.classObject = obj;
    };
    JavaClass.prototype.getClassObject = function () {
        return this.classObject;
    };
    JavaClass.isPrimitive = function (className) {
        return !(this.wrapperMapping[className] == null);
    };
    JavaClass.isWrappedPrimitive = function (className) {
        return this.wrappers.includes(className);
    };
    JavaClass.getPrimitiveName = function (className) {
        return this.primitives[className];
    };
    JavaClass.box = function (className) {
        return this.wrapperMapping[className];
    };
    JavaClass.prototype.getFieldsCount = function () {
        return this.getFields().length;
    };
    JavaClass.wrapperMapping = {
        "B": "java.lang.Byte",
        "C": "java.lang.Character",
        "D": "java.lang.Double",
        "F": "java.lang.Float",
        "I": "java.lang.Integer",
        "J": "java.lang.Long",
        "S": "java.lang.Short",
        "Z": "java.lang.Boolean"
    };
    JavaClass.wrappers = [
        "java.lang.Byte",
        "java.lang.Character",
        "java.lang.Double",
        "java.lang.Float",
        "java.lang.Integer",
        "java.lang.Long",
        "java.lang.Short",
        "java.lang.Boolean"
    ];
    JavaClass.primitives = {
        "byte": "java.lang.Byte",
        "char": "java.lang.Character",
        "double": "java.lang.Double",
        "float": "java.lang.Float",
        "int": "java.lang.Integer",
        "long": "java.lang.Long",
        "short": "java.lang.Short",
        "boolean": "java.lang.Boolean",
        "void": "java.lang.Void"
    };
    return JavaClass;
}(ClassFile_1.default));
exports.default = JavaClass;
var Member = /** @class */ (function () {
    function Member(declaringClass, typeName, modifiers, name, synthetic) {
        this.declaringClass = declaringClass;
        this.typeName = typeName;
        this.modifiers = modifiers;
        this.name = name;
        this.synthetic = synthetic;
    }
    return Member;
}());
exports.Member = Member;
var Field = /** @class */ (function (_super) {
    __extends(Field, _super);
    function Field(declaringClass, info) {
        return _super.call(this, declaringClass, (0, BootstrapClassLoader_1.getArgumentsAndReturnType)((0, ConstantPoolInfo_1.readUtf8FromConstantPool)(declaringClass.constantPool, info.descriptorIndex))[1].split("/").join("."), info.accessFlags, (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(declaringClass.constantPool, info.nameIndex), false) || this;
    }
    return Field;
}(Member));
exports.Field = Field;
var Executable = /** @class */ (function () {
    function Executable(declaredClass, parameterCount, modifiers, name, synthetic, varArgs) {
        this.declaredClass = declaredClass;
        this.parameterCount = parameterCount;
        this.modifiers = modifiers;
        this.name = name;
        this.synthetic = synthetic;
        this.varArgs = varArgs;
    }
    return Executable;
}());
exports.Executable = Executable;
var Method = /** @class */ (function (_super) {
    __extends(Method, _super);
    function Method(declaredClass, methodInfo) {
        return _super.call(this, declaredClass, (0, BootstrapClassLoader_1.getArgumentsAndReturnType)((0, ConstantPoolInfo_1.readUtf8FromConstantPool)(declaredClass.constantPool, methodInfo.descriptorIndex))[0].length, methodInfo.accessFlags, (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(declaredClass.constantPool, methodInfo.nameIndex), false, false) || this;
    }
    return Method;
}(Executable));
exports.Method = Method;
//# sourceMappingURL=JavaClass.js.map