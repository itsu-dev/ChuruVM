"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDescriptor = exports.getConstantPoolInfo = exports.getArgumentsAndReturnType = void 0;
var JavaClass_1 = __importDefault(require("./cfl/JavaClass"));
var ConstantPoolInfo_1 = require("../models/info/ConstantPoolInfo");
var ByteBuffer_1 = require("../utils/ByteBuffer");
var AttributeInfo_1 = require("../models/info/AttributeInfo");
var Log_1 = require("../utils/Log");
var ExceptionHandler_1 = require("../utils/ExceptionHandler");
var BootstrapClassLoader = /** @class */ (function () {
    function BootstrapClassLoader() {
    }
    BootstrapClassLoader.getInstance = function () {
        return BootstrapClassLoader.INSTANCE;
    };
    BootstrapClassLoader.prototype.setRuntimeDataArea = function (runtimeDataArea) {
        if (this.runtimeDataArea == null) {
            this.runtimeDataArea = runtimeDataArea;
        }
    };
    BootstrapClassLoader.prototype.findClass = function (name) {
        var _a, _b;
        if (name.startsWith("[")) {
            name = name.substring(1);
        }
        if (name.startsWith("L")) {
            name = name.substring(1);
        }
        if (name.endsWith(";")) {
            name = name.substring(0, name.length - 1);
        }
        if (JavaClass_1.default.isPrimitive(name)) {
            name = JavaClass_1.default.box(name);
        }
        (0, Log_1.logClass)("FINDCLASS", name);
        if (!(this.runtimeDataArea.
            classHeap[name] == null))
            return this.runtimeDataArea.classHeap[name];
        if (this.runtimeDataArea.loadedClasses[name + ".class"]) {
            return this.defineClass(name, this.runtimeDataArea.loadedClasses[name + ".class"]);
        }
        var fileName = "";
        if (JavaClass_1.default.getPrimitiveName(name)) {
            fileName = JavaClass_1.default.getPrimitiveName(name).split(".").join("/") + ".class";
        }
        else {
            fileName = name.split(".").join("/") + ".class";
        }
        var unzipped = (_b = (_a = this.runtimeDataArea.loadedJars.filter(function (value) { return !(value.unzipped[fileName] == null); })) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.unzipped;
        if (unzipped == null) {
            (0, ExceptionHandler_1.throwException)("java.lang.ClassNotFoundException: " + name, this.runtimeDataArea);
            return null;
        }
        return this.defineClass(name, unzipped[fileName]);
    };
    BootstrapClassLoader.prototype.defineClass = function (name, array, off) {
        if (off === void 0) { off = 0; }
        var buffer = new ByteBuffer_1.ByteBuffer(array.buffer);
        buffer.offset = off;
        var magic = buffer.getUint32();
        var minorVersion = buffer.getUint16();
        var majorVersion = buffer.getUint16();
        var constantPoolCount = buffer.getUint16();
        var constantPool = [];
        for (var i = 1; i < constantPoolCount; i++) {
            var tag = buffer.getUint8();
            var info = void 0;
            switch (tag) {
                case ConstantPoolInfo_1.CONSTANT_CLASS:
                    info = {
                        tag: tag,
                        nameIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_FIELD_REF:
                case ConstantPoolInfo_1.CONSTANT_METHOD_REF:
                case ConstantPoolInfo_1.CONSTANT_INTERFACE_METHOD_REF:
                    info = {
                        tag: tag,
                        classIndex: buffer.getUint16(),
                        nameAndTypeIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_STRING:
                    info = {
                        tag: tag,
                        stringIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_INTEGER:
                    info = {
                        tag: tag,
                        bytes: [buffer.getUint8(), buffer.getUint8(), buffer.getUint8(), buffer.getUint8()]
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_FLOAT:
                    info = {
                        tag: tag,
                        bytes: [buffer.getUint8(), buffer.getUint8(), buffer.getUint8(), buffer.getUint8()]
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_LONG:
                    info = {
                        tag: tag,
                        highBytes: buffer.getUint32(),
                        lowBytes: buffer.getUint32()
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_DOUBLE:
                    info = {
                        tag: tag,
                        highBytes: buffer.getUint32(),
                        lowBytes: buffer.getUint32()
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_NAME_AND_TYPE:
                    info = {
                        tag: tag,
                        nameIndex: buffer.getUint16(),
                        descriptorIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_UTF8:
                    var length_1 = buffer.getUint16();
                    var utf8Buffer = new ByteBuffer_1.ByteBuffer(new ArrayBuffer(length_1));
                    for (var j = 0; j < length_1; j++) {
                        utf8Buffer.setUint8(buffer.getUint8());
                    }
                    info = {
                        tag: tag,
                        length: length_1,
                        bytes: utf8Buffer
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_METHOD_HANDLE:
                    info = {
                        tag: tag,
                        referenceKind: buffer.getUint8(),
                        referenceIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_METHOD_TYPE:
                    info = {
                        tag: tag,
                        descriptorIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_1.CONSTANT_INVOKE_DYNAMIC:
                    info = {
                        tag: tag,
                        bootstrapMethodAttrIndex: buffer.getUint16(),
                        nameAndTypeIndex: buffer.getUint16()
                    };
                    break;
            }
            constantPool.push({
                tag: tag,
                id: i,
                info: info
            });
            if (tag === ConstantPoolInfo_1.CONSTANT_LONG || tag === ConstantPoolInfo_1.CONSTANT_DOUBLE)
                i += 1;
        }
        var accessFlags = buffer.getUint16();
        var thisClass = buffer.getUint16();
        var superClass = buffer.getUint16();
        var interfacesCount = buffer.getUint16();
        var interfaces = [];
        for (var i = 0; i < interfacesCount; i++) {
            interfaces.push(buffer.getUint16());
        }
        var fieldsCount = buffer.getUint16();
        var fields = [];
        for (var i = 0; i < fieldsCount; i++) {
            var accessFlags_1 = buffer.getUint16();
            var nameIndex = buffer.getUint16();
            var descriptorIndex = buffer.getUint16();
            var attributesCount_1 = buffer.getUint16();
            var attributes_1 = (0, AttributeInfo_1.readAttributes)(constantPool, attributesCount_1, buffer);
            fields.push({
                accessFlags: accessFlags_1,
                nameIndex: nameIndex,
                descriptorIndex: descriptorIndex,
                attributesCount: attributesCount_1,
                attributes: attributes_1
            });
        }
        var methodsCount = buffer.getUint16();
        var methods = [];
        for (var i = 0; i < methodsCount; i++) {
            var accessFlags_2 = buffer.getUint16();
            var nameIndex = buffer.getUint16();
            var descriptorIndex = buffer.getUint16();
            var attributeCount = buffer.getUint16();
            var attributes_2 = (0, AttributeInfo_1.readAttributes)(constantPool, attributeCount, buffer);
            methods.push({
                accessFlags: accessFlags_2,
                nameIndex: nameIndex,
                descriptorIndex: descriptorIndex,
                attributesCount: attributeCount,
                attributes: attributes_2
            });
        }
        var attributesCount = buffer.getUint16();
        var attributes = (0, AttributeInfo_1.readAttributes)(constantPool, attributesCount, buffer);
        var klass = new JavaClass_1.default(name.split("/").join("."));
        klass.constantPool = constantPool;
        klass.accessFlags = accessFlags;
        klass.thisClassIndex = thisClass;
        klass.superClassIndex = superClass;
        klass.interfacesCount = interfacesCount;
        klass.interfaces = interfaces;
        klass.fieldsCount = fieldsCount;
        klass.fieldInfos = fields;
        klass.methodsCount = methodsCount;
        klass.methodInfos = methods;
        klass.attributesCount = attributesCount;
        klass.attributes = attributes;
        klass.init();
        this.runtimeDataArea.classHeap[name] = klass;
        return klass;
    };
    BootstrapClassLoader.INSTANCE = new BootstrapClassLoader();
    return BootstrapClassLoader;
}());
exports.default = BootstrapClassLoader;
var getArgumentsAndReturnType = function (descriptor) {
    var returnTypeSplit = descriptor.split(")");
    return [(0, exports.parseDescriptor)(descriptor), returnTypeSplit[returnTypeSplit.length - 1]];
};
exports.getArgumentsAndReturnType = getArgumentsAndReturnType;
var getConstantPoolInfo = function (constantPool, index) {
    return constantPool.filter(function (constant) { return constant.id === index; })[0];
};
exports.getConstantPoolInfo = getConstantPoolInfo;
var parseDescriptor = function (descriptor) {
    var _a;
    var temp = (_a = descriptor.match("(?<=\\()[^\\(\\)]+(?=\\))")) === null || _a === void 0 ? void 0 : _a[0];
    if (temp == null)
        return [];
    var primitives = ["B", "C", "D", "F", "I", "J", "S", "Z"];
    var args = [];
    var STATE_NORMAL = 0;
    var STATE_OBJECT = 1;
    var state = STATE_NORMAL;
    var isArray = false;
    var objectName = "";
    temp.split("").forEach(function (char) {
        switch (state) {
            case STATE_NORMAL: {
                if (primitives.includes(char)) {
                    args.push((isArray ? "[" : "") + char);
                    isArray = false;
                }
                else if (char === "L")
                    state = STATE_OBJECT;
                else if (char === "[")
                    isArray = true;
                break;
            }
            case STATE_OBJECT: {
                if (char !== ";")
                    objectName += char;
                else {
                    args.push((isArray ? "[" : "") + objectName);
                    isArray = false;
                    objectName = "";
                    state = STATE_NORMAL;
                }
                break;
            }
        }
    });
    return args;
};
exports.parseDescriptor = parseDescriptor;
//# sourceMappingURL=BootstrapClassLoader.js.map