"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgumentsAndReturnType = exports.parseDescriptor = exports.getConstantPoolInfo = void 0;
var ConstantPoolInfo_js_1 = require("../../models/info/ConstantPoolInfo.js");
var ByteBuffer_js_1 = require("../../utils/ByteBuffer.js");
var AttributeInfo_js_1 = require("../../models/info/AttributeInfo.js");
var ClassFileLoader = /** @class */ (function () {
    function ClassFileLoader() {
    }
    ClassFileLoader.loadClassFile = function (buffer) {
        var magic = buffer.getUint32();
        var minorVersion = buffer.getUint16();
        var majorVersion = buffer.getUint16();
        var constantPoolCount = buffer.getUint16();
        var constantPool = [];
        for (var i = 1; i < constantPoolCount; i++) {
            var tag = buffer.getUint8();
            var info = void 0;
            switch (tag) {
                case ConstantPoolInfo_js_1.CONSTANT_CLASS:
                    info = {
                        tag: tag,
                        nameIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_FIELD_REF:
                case ConstantPoolInfo_js_1.CONSTANT_METHOD_REF:
                case ConstantPoolInfo_js_1.CONSTANT_INTERFACE_METHOD_REF:
                    info = {
                        tag: tag,
                        classIndex: buffer.getUint16(),
                        nameAndTypeIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_STRING:
                    info = {
                        tag: tag,
                        stringIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_INTEGER:
                    info = {
                        tag: tag,
                        bytes: buffer.getInt32()
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_FLOAT:
                    info = {
                        tag: tag,
                        bytes: buffer.getUint32()
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_LONG:
                    info = {
                        tag: tag,
                        highBytes: buffer.getUint32(),
                        lowBytes: buffer.getUint32()
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_DOUBLE:
                    info = {
                        tag: tag,
                        highBytes: buffer.getUint32(),
                        lowBytes: buffer.getUint32()
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_NAME_AND_TYPE:
                    info = {
                        tag: tag,
                        nameIndex: buffer.getUint16(),
                        descriptorIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_UTF8:
                    var length_1 = buffer.getUint16();
                    var utf8Buffer = new ByteBuffer_js_1.ByteBuffer(new ArrayBuffer(length_1));
                    for (var j = 0; j < length_1; j++) {
                        utf8Buffer.setUint8(buffer.getUint8());
                    }
                    info = {
                        tag: tag,
                        length: length_1,
                        bytes: utf8Buffer
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_METHOD_HANDLE:
                    info = {
                        tag: tag,
                        referenceKind: buffer.getUint8(),
                        referenceIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_METHOD_TYPE:
                    info = {
                        tag: tag,
                        descriptorIndex: buffer.getUint16()
                    };
                    break;
                case ConstantPoolInfo_js_1.CONSTANT_INVOKE_DYNAMIC:
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
            if (tag === ConstantPoolInfo_js_1.CONSTANT_LONG || tag === ConstantPoolInfo_js_1.CONSTANT_DOUBLE)
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
            var attributesCount = buffer.getUint16();
            var attributes = (0, AttributeInfo_js_1.readAttributes)(constantPool, attributesCount, buffer);
            fields.push({
                accessFlags: accessFlags_1,
                nameIndex: nameIndex,
                descriptorIndex: descriptorIndex,
                attributesCount: attributesCount,
                attributes: attributes
            });
        }
        var methodsCount = buffer.getUint16();
        var methods = [];
        for (var i = 0; i < methodsCount; i++) {
            var accessFlags_2 = buffer.getUint16();
            var nameIndex = buffer.getUint16();
            var descriptorIndex = buffer.getUint16();
            var attributeCount = buffer.getUint16();
            var attributes = (0, AttributeInfo_js_1.readAttributes)(constantPool, attributeCount, buffer);
            methods.push({
                accessFlags: accessFlags_2,
                nameIndex: nameIndex,
                descriptorIndex: descriptorIndex,
                attributesCount: attributeCount,
                attributes: attributes
            });
        }
        return {
            magic: magic,
            minorVersion: minorVersion,
            majorVersion: majorVersion,
            constantPoolCount: constantPoolCount,
            constantPool: constantPool,
            accessFlags: accessFlags,
            thisClass: thisClass,
            superClass: superClass,
            interfacesCount: interfacesCount,
            interfaces: interfaces,
            fieldsCount: fieldsCount,
            fields: fields,
            methodsCount: methodsCount,
            methods: methods,
            attributesCount: 0,
            attributes: []
        };
    };
    ClassFileLoader.getClassName = function (packageName) {
        var split = packageName.split("/");
        return split[split.length - 1];
    };
    return ClassFileLoader;
}());
exports.default = ClassFileLoader;
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
var getArgumentsAndReturnType = function (descriptor) {
    var returnTypeSplit = descriptor.split(")");
    return [(0, exports.parseDescriptor)(descriptor), returnTypeSplit[returnTypeSplit.length - 1]];
};
exports.getArgumentsAndReturnType = getArgumentsAndReturnType;
//# sourceMappingURL=ClassFileLoader.js.map