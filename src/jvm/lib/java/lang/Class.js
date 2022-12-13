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
exports.Class = void 0;
var JavaClass_1 = __importDefault(require("../../../core/cfl/JavaClass"));
var types_1 = require("../../../core/cfl/types");
var Utils_1 = require("../../../utils/Utils");
var BootstrapClassLoader_1 = __importStar(require("../../../core/BootstrapClassLoader"));
var ConstantPoolInfo_1 = require("../../../models/info/ConstantPoolInfo");
var Class = /** @class */ (function (_super) {
    __extends(Class, _super);
    function Class() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Class.registerNatives = function (thread, klazz, obj) {
        return;
    };
    Class.getClassLoader0 = function (thread, klazz, obj) {
        // TODO
        return null;
    };
    Class.forName0 = function (thread, klazz, obj, name, initialize, loader, caller) {
        var name0 = (0, Utils_1.getString)(thread.runtimeDataArea, name);
        return thread.runtimeDataArea.createClassObject(thread, BootstrapClassLoader_1.default.getInstance().findClass(name0));
    };
    Class.desiredAssertionStatus0 = function (thread, klazz, obj, clazz) {
        // TODO
        return true;
    };
    Class.isInterface = function (thread, klazz, obj) {
        return klazz.accessFlags & 512;
    };
    Class.isAssignableFrom = function (thread, klazz, obj, _cls) {
        var _a;
        return klazz.name == _cls.type.name || ((_a = klazz.superClass) === null || _a === void 0 ? void 0 : _a.name) == _cls.type.name;
    };
    Class.getPrimitiveClass = function (thread, klazz, obj, name) {
        var name0 = (0, Utils_1.getString)(thread.runtimeDataArea, name);
        return thread.runtimeDataArea.createClassObject(thread, BootstrapClassLoader_1.default.getInstance().findClass(name0));
    };
    Class.isArray = function (thread, klazz, obj) {
        return obj.isArray;
    };
    Class.getComponentType = function (thread, klazz, obj) {
        console.log(obj.isArray, klazz.name);
        return thread.runtimeDataArea.createClassObject(thread, obj.type);
    };
    /*
    @return Object[]?
    Object[0]: Class<?> enclosingClass
    Object[1]: String name
    Object[2]: String descriptor
     */
    Class.getEnclosingMethod0 = function (thread, klazz, obj) {
        var enclosingMethodAttrs = klazz.attributes.filter(function (attr) { return (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(klazz.constantPool, attr.attributeNameIndex) === "EnclosingMethod"; });
        if (enclosingMethodAttrs.length == 0)
            return null;
        var enclosingMethodAttr = enclosingMethodAttrs[0];
        var nameAndTypeInfo = (0, BootstrapClassLoader_1.getConstantPoolInfo)(klazz.constantPool, enclosingMethodAttr.methodIndex).info;
        var classInfo = (0, BootstrapClassLoader_1.getConstantPoolInfo)(klazz.constantPool, enclosingMethodAttr.classIndex).info;
        var clazz = BootstrapClassLoader_1.default.getInstance().findClass((0, ConstantPoolInfo_1.readUtf8FromConstantPool)(klazz.constantPool, classInfo.nameIndex).split("/").join("."));
        var name = thread.runtimeDataArea.createStringObject(thread, (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(klazz.constantPool, nameAndTypeInfo.nameIndex));
        var descriptor = thread.runtimeDataArea.createStringObject(thread, (0, ConstantPoolInfo_1.readUtf8FromConstantPool)(klazz.constantPool, nameAndTypeInfo.descriptorIndex));
        var array = thread.runtimeDataArea.objectHeap[thread.runtimeDataArea.createAArray("java.lang.Object", 3).heapIndex];
        array.push([clazz, name, descriptor]);
        return array;
    };
    Class.getDeclaringClass0 = function (thread, klazz, obj) {
        var split = klazz.name.split(".");
        var names = split[split.length - 1].split("$");
        if (names.length == 1)
            return null;
        var enclosingClassName = "";
        for (var i = 0; i < split.length - 1; i++) {
            enclosingClassName += split[i] + ".";
        }
        for (var i = 0; i < names.length - 1; i++) {
            enclosingClassName += names[i] + ".";
        }
        enclosingClassName = enclosingClassName.substring(0, enclosingClassName.length - 2);
        return thread.runtimeDataArea.createClassObject(thread, BootstrapClassLoader_1.default.getInstance().findClass(enclosingClassName));
    };
    Class.getModifiers = function (thread, klazz, obj) {
        return klazz.accessFlags;
    };
    Class.getDeclaredFields0 = function (thread, klazz, obj, _publicOnly) {
        var clazz = BootstrapClassLoader_1.default.getInstance().findClass((0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(obj, "name")));
        var array = thread.runtimeDataArea.createAArray("java.lang.reflect.Field", clazz.getDeclaredFields().length);
        clazz.getDeclaredFields().forEach(function (field, index) {
            // TODO publiconly
            var obj = thread.runtimeDataArea.createObject("java.lang.reflect.Field");
            var args = [];
            args.push(thread.runtimeDataArea.createClassObject(thread, field.declaringClass));
            args.push(thread.runtimeDataArea.createStringObject(thread, field.name));
            args.push(thread.runtimeDataArea.createClassObject(thread, BootstrapClassLoader_1.default.getInstance().findClass(field.typeName)));
            args.push(field.modifiers);
            args.push(0);
            args.push(thread.runtimeDataArea.createStringObject(thread, ""));
            args.push(thread.runtimeDataArea.createPArray(8, 0));
            thread.invokeMethod("<init>", "(Ljava/lang/Class;Ljava/lang/String;Ljava/lang/Class;IILjava/lang/String;[B)V", obj.type, args.reverse(), obj);
            thread.runtimeDataArea.objectHeap[array.heapIndex][index] = obj;
        });
        return array;
    };
    Class.isPrimitive = function (thread, klazz, obj) {
        var clazz = BootstrapClassLoader_1.default.getInstance().findClass((0, Utils_1.getString)(thread.runtimeDataArea, (0, Utils_1.getFieldValue)(obj, "name")));
        console.log(clazz.name);
        return JavaClass_1.default.isWrappedPrimitive(clazz.name);
    };
    return Class;
}(types_1.JavaObject));
exports.Class = Class;
//# sourceMappingURL=Class.js.map