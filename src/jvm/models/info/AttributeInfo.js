"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEnclosingMethodAttribute = exports.processLocalVariableAttribute = exports.processStackMapAttribute = exports.processBootstrapMethodsAttribute = exports.processInnerClassesAttribute = exports.processLineNumberAttribute = exports.processCodeAttribute = exports.readAttributes = void 0;
var ByteBuffer_js_1 = require("../../utils/ByteBuffer.js");
var ConstantPoolInfo_js_1 = require("./ConstantPoolInfo.js");
var readAttributes = function (constantPool, length, buffer) {
    var result = [];
    for (var j = 0; j < length; j++) {
        var attributeNameIndex = buffer.getUint16();
        var attributeLength = buffer.getUint32();
        var name_1 = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(constantPool, attributeNameIndex);
        switch (name_1) {
            case "Code": {
                result.push((0, exports.processCodeAttribute)(constantPool, attributeNameIndex, attributeLength, buffer));
                break;
            }
            case "LineNumberTable": {
                result.push((0, exports.processLineNumberAttribute)(attributeNameIndex, attributeLength, buffer));
                break;
            }
            case "StackMapTable": {
                result.push((0, exports.processStackMapAttribute)(attributeNameIndex, attributeLength, buffer));
                break;
            }
            case "LocalVariableTable": {
                result.push((0, exports.processLocalVariableAttribute)(attributeNameIndex, attributeLength, buffer));
                break;
            }
            case "InnerClasses": {
                result.push((0, exports.processInnerClassesAttribute)(attributeNameIndex, attributeLength, buffer));
                break;
            }
            case "BootstrapMethods": {
                result.push((0, exports.processBootstrapMethodsAttribute)(attributeNameIndex, attributeLength, buffer));
                break;
            }
            case "EnclosingMethod": {
                result.push((0, exports.processEnclosingMethodAttribute)(attributeNameIndex, attributeLength, buffer));
                break;
            }
            default: {
                buffer.offset += attributeLength;
            }
        }
    }
    return result;
};
exports.readAttributes = readAttributes;
var processCodeAttribute = function (constantPool, attributeNameIndex, attributeLength, buffer) {
    var maxStack = buffer.getUint16();
    var maxLocals = buffer.getUint16();
    var codeLength = buffer.getUint32();
    var code = new ByteBuffer_js_1.ByteBuffer(new ArrayBuffer(codeLength));
    for (var i = 0; i < codeLength; i++) {
        code.setUint8(buffer.getUint8());
    }
    var exceptionTableLength = buffer.getUint16();
    var exceptionTable = [];
    for (var i = 0; i < exceptionTableLength; i++) {
        exceptionTable.push({
            startPc: buffer.getUint16(),
            endPc: buffer.getUint16(),
            handlerPc: buffer.getUint16(),
            catchType: buffer.getUint16()
        });
    }
    var attributesCount = buffer.getUint16();
    var attributes = [];
    if (attributesCount > 0) {
        attributes = (0, exports.readAttributes)(constantPool, attributesCount, buffer);
    }
    return {
        attributeNameIndex: attributeNameIndex,
        attributeLength: attributeLength,
        info: [],
        maxStack: maxStack,
        maxLocals: maxLocals,
        codeLength: codeLength,
        code: code,
        exceptionTableLength: exceptionTableLength,
        exceptionTable: exceptionTable,
        attributesCount: attributesCount,
        attributes: attributes
    };
};
exports.processCodeAttribute = processCodeAttribute;
var processLineNumberAttribute = function (attributeNameIndex, attributeLength, buffer) {
    var lineNumberTableLength = buffer.getUint16();
    var lineNumberTable = [];
    for (var i = 0; i < lineNumberTableLength; i++) {
        lineNumberTable.push({
            startPc: buffer.getUint16(),
            lineNumber: buffer.getUint16()
        });
    }
    return {
        attributeNameIndex: attributeNameIndex,
        attributeLength: attributeLength,
        info: [],
        lineNumberTableLength: lineNumberTableLength,
        lineNumberTable: lineNumberTable
    };
};
exports.processLineNumberAttribute = processLineNumberAttribute;
var processInnerClassesAttribute = function (attributeNameIndex, attributeLength, buffer) {
    var numberOfClasses = buffer.getUint16();
    var innerClasses = [];
    for (var i = 0; i < numberOfClasses; i++) {
        innerClasses.push({
            innerClassInfoIndex: buffer.getUint16(),
            outerClassInfoIndex: buffer.getUint16(),
            innerNameIndex: buffer.getUint16(),
            innerClassAccessFlags: buffer.getUint16()
        });
    }
    return {
        attributeNameIndex: attributeNameIndex,
        attributeLength: attributeLength,
        info: [],
        classes: innerClasses,
        numberOfClasses: numberOfClasses
    };
};
exports.processInnerClassesAttribute = processInnerClassesAttribute;
var processBootstrapMethodsAttribute = function (attributeNameIndex, attributeLength, buffer) {
    var numBootstrapMethods = buffer.getUint16();
    var methods = [];
    for (var i = 0; i < numBootstrapMethods; i++) {
        var bootstrapMethodRef = buffer.getUint16();
        var numBootstrapMethods_1 = buffer.getUint16();
        var args = [];
        for (var j = 0; j < numBootstrapMethods_1; j++) {
            args.push(buffer.getUint16());
        }
        methods.push({
            bootstrapMethodRef: bootstrapMethodRef,
            numBootstrapMethods: numBootstrapMethods_1,
            bootstrapArguments: args
        });
    }
    return {
        attributeNameIndex: attributeNameIndex,
        attributeLength: attributeLength,
        info: [],
        bootstrapMethods: methods,
        numBootstrapMethods: numBootstrapMethods
    };
};
exports.processBootstrapMethodsAttribute = processBootstrapMethodsAttribute;
var processStackMapAttribute = function (attributeNameIndex, attributeLength, buffer) {
    var numberOfEntries = buffer.getUint16();
    var entries = [];
    var getVerificationTypeInfo = function (tag) {
        switch (tag) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6: {
                return {
                    info: {
                        tag: tag
                    }
                };
            }
            case 7: {
                return {
                    info: {
                        tag: tag,
                        cpoolIndex: buffer.getUint16()
                    }
                };
            }
            case 8: {
                return {
                    info: {
                        tag: tag,
                        offset: buffer.getUint16()
                    }
                };
            }
        }
    };
    for (var i = 0; i < numberOfEntries; i++) {
        var frameType = buffer.getUint8();
        // same_frame
        if (0 <= frameType && frameType <= 63) {
            entries.push({
                frame: {
                    frameType: frameType
                }
            });
            // same_locals_1_stack_item_frame
        }
        else if (64 <= frameType && frameType <= 127) {
            entries.push({
                frame: {
                    frameType: frameType,
                    stack: [getVerificationTypeInfo(buffer.getUint8())]
                }
            });
            // same_locals_1_stack_item_frame_extended
        }
        else if (frameType == 247) {
            entries.push({
                frame: {
                    frameType: frameType,
                    offsetDelta: buffer.getUint16(),
                    stack: [getVerificationTypeInfo(buffer.getUint8())]
                }
            });
            // chop_frame
        }
        else if (248 <= frameType && frameType <= 250) {
            entries.push({
                frame: {
                    frameType: frameType,
                    offsetDelta: buffer.getUint16()
                }
            });
            // same_frame_extended
        }
        else if (frameType == 251) {
            entries.push({
                frame: {
                    frameType: frameType,
                    offsetDelta: buffer.getUint16()
                }
            });
            // append_frame
        }
        else if (252 <= frameType && frameType <= 254) {
            var appendFrameOffsetDelta = buffer.getUint16();
            var appendFrameLocals = [];
            for (var j = 0; j < frameType - 251; j++) {
                appendFrameLocals.push(getVerificationTypeInfo(buffer.getUint8()));
            }
            entries.push({
                frame: {
                    frameType: frameType,
                    offsetDelta: appendFrameOffsetDelta,
                    locals: appendFrameLocals
                }
            });
            // full_frame
        }
        else if (frameType == 255) {
            var fullFrameOffsetDelta = buffer.getUint16();
            var numberOfLocals = buffer.getUint16();
            var fullFrameLocals = [];
            for (var j = 0; j < numberOfLocals; j++) {
                fullFrameLocals.push(getVerificationTypeInfo(buffer.getUint8()));
            }
            var numberOfStackItems = buffer.getUint16();
            var fullFrameStack = [];
            for (var j = 0; j < numberOfStackItems; j++) {
                fullFrameStack.push(getVerificationTypeInfo(buffer.getUint8()));
            }
            entries.push({
                frame: {
                    frameType: frameType,
                    offsetDelta: fullFrameOffsetDelta,
                    numberOfLocals: numberOfLocals,
                    locals: fullFrameLocals,
                    numberOfStackItems: numberOfStackItems,
                    stack: fullFrameStack
                }
            });
        }
    }
    return {
        attributeNameIndex: attributeNameIndex,
        attributeLength: attributeLength,
        info: [],
        numberOfEntries: numberOfEntries,
        entries: entries
    };
};
exports.processStackMapAttribute = processStackMapAttribute;
var processLocalVariableAttribute = function (attributeNameIndex, attributeLength, buffer) {
    var localVariableTableLength = buffer.getUint16();
    var localVariableTable = [];
    for (var i = 0; i < localVariableTableLength; i++) {
        localVariableTable.push({
            startPc: buffer.getUint16(),
            length: buffer.getUint16(),
            nameIndex: buffer.getUint16(),
            descriptorIndex: buffer.getUint16(),
            index: buffer.getUint16()
        });
    }
    return {
        attributeNameIndex: attributeNameIndex,
        attributeLength: attributeLength,
        localVariableTable: localVariableTable,
        localVariableTableLength: localVariableTableLength,
        info: []
    };
};
exports.processLocalVariableAttribute = processLocalVariableAttribute;
var processEnclosingMethodAttribute = function (attributeNameIndex, attributeLength, buffer) {
    var classIndex = buffer.getUint16();
    var methodIndex = buffer.getUint16();
    return {
        attributeNameIndex: attributeNameIndex,
        attributeLength: attributeLength,
        classIndex: classIndex,
        methodIndex: methodIndex,
        info: []
    };
};
exports.processEnclosingMethodAttribute = processEnclosingMethodAttribute;
//# sourceMappingURL=AttributeInfo.js.map