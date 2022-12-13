"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = void 0;
var ConstantPoolInfo_js_1 = require("../../../models/info/ConstantPoolInfo.js");
var ByteBuffer_js_1 = require("../../../utils/ByteBuffer.js");
var ClassFileLoader_js_1 = require("../../cfl/ClassFileLoader.js");
var BootstrapClassLoader_1 = __importDefault(require("../../BootstrapClassLoader"));
var types_1 = require("../../cfl/types");
var Utils_1 = require("../../../utils/Utils");
var JavaObject_1 = require("../../../lib/java/lang/JavaObject");
var ExceptionHandler_1 = require("../../../utils/ExceptionHandler");
var Frame = /** @class */ (function () {
    function Frame(thread, runtimeDataArea, method, javaClass, localSize, constantPool, args, javaObject) {
        var _this = this;
        this.opcodes = new Array();
        this.isRunning = true;
        this.operandStack = [];
        this.thread = thread;
        this.runtimeDataArea = runtimeDataArea;
        this.method = method;
        this.javaClass = javaClass;
        this.locals = new Array(localSize);
        this.constantPool = constantPool;
        this.javaObject = javaObject;
        // create this object on object heap
        var offset = 0;
        if (!(this.javaObject == null)) {
            this.locals[0] = new types_1.JavaVariable(this.javaClass.name, this.javaObject);
            offset++;
        }
        var argsData = (0, ClassFileLoader_js_1.getArgumentsAndReturnType)((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(javaClass.constantPool, this.method.descriptorIndex))[0];
        args.reverse().forEach(function (arg, index) {
            _this.locals[index + offset] = new types_1.JavaVariable(argsData[index].split("/").join("."), arg);
        });
    }
    Frame.prototype.execute = function () {
        return this.executeOpcodes(0);
    };
    Frame.prototype.executeOpcodes = function (id) {
        var _this = this;
        // TODO
        var name = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this.constantPool, this.method.nameIndex);
        if (name === "newInstance") {
            var klazz = (0, Utils_1.getString)(this.runtimeDataArea, this.runtimeDataArea.objectHeap[this.locals[0].value.heapIndex].filter(function (v) { return v.name === "name"; })[0].value);
            var obj = this.javaClass.getSimpleName() == "Array" ? this.runtimeDataArea.createAArray(klazz, this.locals[0].value) : this.runtimeDataArea.createObject(klazz);
            obj.init(this.runtimeDataArea);
            this.thread.invokeMethod("<init>", "()V", obj.type, [], obj);
            return obj;
        }
        // TODO
        if (name == "clone") {
            return Object.assign(Object.create(Object.getPrototypeOf(this.javaObject)), this.javaObject);
        }
        // TODO
        if (name == "checkForTypeAlias" || name == "checkSlotCount")
            return;
        if (name == "parameterSlotCount")
            return 0;
        if (name == "referenceKindIsConsistent" || name == "vminfoIsConsistent" || name == "verifyConstants")
            return true;
        if (this.javaClass.name == "java.lang.ref.Reference" && name == "<clinit>")
            return;
        if (this.opcodes[this.opcodes.length - 1].id < id) {
            id = id - 65536;
        }
        var index = this.getOpcodeIndexById(id);
        var _loop_1 = function (i) {
            this_1.opcode = this_1.opcodes[i];
            if (!this_1.isRunning || !this_1.opcode)
                return "break";
            if (((23 <= this_1.opcode.id && this_1.opcode.id <= 38) || (115 <= this_1.opcode.id && this_1.opcode.id <= 123) || (138 <= this_1.opcode.id && this_1.opcode.id <= 138)) && name === "initializeSystemClass")
                return "continue";
            switch (this_1.opcode.opcode) {
                // nop
                case 0x00: {
                    break;
                }
                // aconst_null
                case 0x01: {
                    this_1.operandStack.push(null);
                    break;
                }
                // getstatic
                case 0xb2: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var constantPoolInfo = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2);
                    var fieldRef = constantPoolInfo.info;
                    var classRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, fieldRef.classIndex).info;
                    var fieldNameAndTypeRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, fieldRef.nameAndTypeIndex).info;
                    var klass = BootstrapClassLoader_1.default.getInstance().findClass((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, classRef.nameIndex).split("/").join("."));
                    klass.initStatic(this_1.thread);
                    var field = klass.getDeclaredField((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, fieldNameAndTypeRef.nameIndex));
                    this_1.operandStack.push(field.staticValue);
                    break;
                }
                // putstatic
                case 0xb3: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var constantPoolInfo = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2);
                    var fieldRef = constantPoolInfo.info;
                    var classRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, fieldRef.classIndex).info;
                    var fieldNameAndTypeRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, fieldRef.nameAndTypeIndex).info;
                    // const fieldClassFileName = readUtf8FromConstantPool(this.constantPool, fieldNameAndTypeRef.nameIndex).split("/").join(".");
                    var klass = BootstrapClassLoader_1.default.getInstance().findClass((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, classRef.nameIndex).split("/").join("."));
                    klass.initStatic(this_1.thread);
                    var field = klass.getDeclaredField((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, fieldNameAndTypeRef.nameIndex));
                    field.staticValue = this_1.operandStack.pop();
                    break;
                }
                // getfield
                case 0xb4: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var constantPoolInfo = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2);
                    var fieldRef = constantPoolInfo.info;
                    var classRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, fieldRef.classIndex).info;
                    var fieldNameAndTypeRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, fieldRef.nameAndTypeIndex).info;
                    var fieldName_1 = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, fieldNameAndTypeRef.nameIndex);
                    var obj = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.runtimeDataArea.objectHeap[obj.heapIndex]
                        .filter(function (variable) { return variable.name === fieldName_1; })[0]
                        .value);
                    break;
                }
                // putfield
                case 0xb5: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var constantPoolInfo = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2);
                    var fieldRef = constantPoolInfo.info;
                    var classRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, fieldRef.classIndex).info;
                    var fieldNameAndTypeRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, fieldRef.nameAndTypeIndex).info;
                    var fieldName_2 = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, fieldNameAndTypeRef.nameIndex);
                    var value = this_1.operandStack.pop();
                    var obj = this_1.operandStack.pop();
                    this_1.runtimeDataArea.objectHeap[obj.heapIndex]
                        .filter(function (variable) { return variable.name === fieldName_2; })[0]
                        .value = value;
                    break;
                }
                // ldc
                case 0x12: {
                    var index_1 = this_1.opcode.operands[0];
                    var info = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, index_1).info;
                    if (info.tag === ConstantPoolInfo_js_1.CONSTANT_STRING) {
                        var object = this_1.runtimeDataArea.createStringObject(this_1.thread, (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, info.stringIndex));
                        this_1.operandStack.push(object);
                    }
                    else if (info.tag === ConstantPoolInfo_js_1.CONSTANT_INTEGER) {
                        var dataView = new ByteBuffer_js_1.ByteBuffer(new ArrayBuffer(32));
                        dataView.setUint8(info.bytes[0]);
                        dataView.setUint8(info.bytes[1]);
                        dataView.setUint8(info.bytes[2]);
                        dataView.setUint8(info.bytes[3]);
                        dataView.resetOffset();
                        this_1.operandStack.push(info.bytes[0] << 24 | info.bytes[1] << 16 | info.bytes[2] << 8 | info.bytes[3]);
                    }
                    else if (info.tag === ConstantPoolInfo_js_1.CONSTANT_FLOAT) {
                        var dataView = new ByteBuffer_js_1.ByteBuffer(new ArrayBuffer(32));
                        dataView.setUint8(info.bytes[0]);
                        dataView.setUint8(info.bytes[1]);
                        dataView.setUint8(info.bytes[2]);
                        dataView.setUint8(info.bytes[3]);
                        dataView.resetOffset();
                        this_1.operandStack.push(dataView.getFloat32());
                    }
                    else if (info.tag === ConstantPoolInfo_js_1.CONSTANT_CLASS) {
                        var classRef = info;
                        var obj = this_1.runtimeDataArea.createClassObject(this_1.thread, BootstrapClassLoader_1.default.getInstance().findClass((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, classRef.nameIndex).split("/").join(".")));
                        this_1.operandStack.push(obj);
                    }
                    break;
                }
                // ldc_w
                case 0x13: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var info = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                    if (info.tag === ConstantPoolInfo_js_1.CONSTANT_STRING) {
                        var object = this_1.runtimeDataArea.createStringObject(this_1.thread, (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, info.stringIndex));
                        this_1.operandStack.push(object);
                    }
                    else if (info.tag === ConstantPoolInfo_js_1.CONSTANT_INTEGER) {
                        var dataView = new ByteBuffer_js_1.ByteBuffer(new ArrayBuffer(32));
                        dataView.setUint8(info.bytes[0]);
                        dataView.setUint8(info.bytes[1]);
                        dataView.setUint8(info.bytes[2]);
                        dataView.setUint8(info.bytes[3]);
                        dataView.resetOffset();
                        this_1.operandStack.push(dataView.getInt32());
                    }
                    else if (info.tag === ConstantPoolInfo_js_1.CONSTANT_FLOAT) {
                        var dataView = new ByteBuffer_js_1.ByteBuffer(new ArrayBuffer(32));
                        dataView.setUint8(info.bytes[0]);
                        dataView.setUint8(info.bytes[1]);
                        dataView.setUint8(info.bytes[2]);
                        dataView.setUint8(info.bytes[3]);
                        dataView.resetOffset();
                        this_1.operandStack.push(dataView.getFloat32());
                    }
                    else if (info.tag === ConstantPoolInfo_js_1.CONSTANT_CLASS) {
                        var classRef = info;
                        var obj = this_1.runtimeDataArea.createClassObject(this_1.thread, BootstrapClassLoader_1.default.getInstance().findClass((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, classRef.nameIndex).split("/").join(".")));
                        this_1.operandStack.push(obj);
                    }
                    break;
                }
                // ldc2_w
                case 0x14: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var info = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                    if (info.tag === ConstantPoolInfo_js_1.CONSTANT_LONG) {
                        var dataView = new ByteBuffer_js_1.ByteBuffer(new ArrayBuffer(64));
                        dataView.setUint32(info.highBytes);
                        dataView.setUint32(info.lowBytes);
                        dataView.resetOffset();
                        this_1.operandStack.push(dataView.getBigInt64());
                    }
                    else if (info.tag === ConstantPoolInfo_js_1.CONSTANT_DOUBLE) {
                        var dataView = new ByteBuffer_js_1.ByteBuffer(new ArrayBuffer(64));
                        dataView.setUint32(info.highBytes);
                        dataView.setUint32(info.lowBytes);
                        dataView.resetOffset();
                        this_1.operandStack.push(dataView.getFloat64());
                    }
                    break;
                }
                // invokevirtual
                case 0xb6: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var methodRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                    var methodNameAndTypeRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, methodRef.nameAndTypeIndex).info;
                    var clazz = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, methodRef.classIndex).info;
                    var className = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, clazz.nameIndex);
                    var descriptor = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.descriptorIndex);
                    var invokeMethodName = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.nameIndex);
                    var argumentsAndReturnType = (0, ClassFileLoader_js_1.getArgumentsAndReturnType)((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.descriptorIndex));
                    var methodArgs = [];
                    for (var i_1 = 0; i_1 < argumentsAndReturnType[0].length; i_1++) {
                        methodArgs.push(this_1.operandStack.pop());
                    }
                    var javaObject = this_1.operandStack.pop();
                    if (javaObject == null) {
                        (0, ExceptionHandler_1.throwException)("java.lang.NullPointerException", this_1.runtimeDataArea);
                        this_1.isRunning = false;
                        return { value: void 0 };
                    }
                    var result = this_1.thread.invokeMethod(invokeMethodName, descriptor, javaObject.type, methodArgs, javaObject);
                    if (result !== undefined) {
                        this_1.operandStack.push(result);
                    }
                    break;
                }
                // iconst_m1
                case 0x02: {
                    this_1.operandStack.push(-1);
                    break;
                }
                // iconst_0
                case 0x03: {
                    this_1.operandStack.push(0);
                    break;
                }
                // iconst_1
                case 0x04: {
                    this_1.operandStack.push(1);
                    break;
                }
                // iconst_2
                case 0x05: {
                    this_1.operandStack.push(2);
                    break;
                }
                // iconst_3
                case 0x06: {
                    this_1.operandStack.push(3);
                    break;
                }
                // iconst_4
                case 0x07: {
                    this_1.operandStack.push(4);
                    break;
                }
                // iconst_5
                case 0x08: {
                    this_1.operandStack.push(5);
                    break;
                }
                // lconst_0
                case 0x09: {
                    this_1.operandStack.push(1);
                    break;
                }
                // lconst_1
                case 0x0a: {
                    this_1.operandStack.push(2);
                    break;
                }
                // fconst_0
                case 0x0b: {
                    this_1.operandStack.push(0.0);
                    break;
                }
                // fconst_1
                case 0x0c: {
                    this_1.operandStack.push(1.0);
                    break;
                }
                // fconst_2
                case 0x0d: {
                    this_1.operandStack.push(2.0);
                    break;
                }
                // dconst_0
                case 0x0e: {
                    this_1.operandStack.push(0.0);
                    break;
                }
                // dconst_1
                case 0x0f: {
                    this_1.operandStack.push(1.0);
                    break;
                }
                // bipush
                case 0x10: {
                    var data = this_1.opcode.operands[0];
                    this_1.operandStack.push(data);
                    break;
                }
                // sipush
                case 0x11: {
                    var byte1 = this_1.opcode.operands[0];
                    var byte2 = this_1.opcode.operands[1];
                    this_1.operandStack.push((byte1 << 8) | byte2);
                    break;
                }
                // iload
                case 0x15: {
                    var index_2 = this_1.opcode.operands[0];
                    this_1.operandStack.push(this_1.locals[index_2].value);
                    break;
                }
                // lload
                case 0x16: {
                    var index_3 = this_1.opcode.operands[0];
                    this_1.operandStack.push(this_1.locals[index_3].value);
                    break;
                }
                // fload
                case 0x17: {
                    var index_4 = this_1.opcode.operands[0];
                    this_1.operandStack.push(this_1.locals[index_4].value);
                    break;
                }
                // dload
                case 0x18: {
                    var index_5 = this_1.opcode.operands[0];
                    this_1.operandStack.push(this_1.locals[index_5].value);
                    break;
                }
                // aload
                case 0x19: {
                    var index_6 = this_1.opcode.operands[0];
                    this_1.operandStack.push(this_1.locals[index_6].value);
                    break;
                }
                // iload_0
                case 0x1a: {
                    this_1.operandStack.push(this_1.locals[0].value);
                    break;
                }
                // iload_1
                case 0x1b: {
                    this_1.operandStack.push(this_1.locals[1].value);
                    break;
                }
                // iload_2
                case 0x1c: {
                    this_1.operandStack.push(this_1.locals[2].value);
                    break;
                }
                // iload_3
                case 0x1d: {
                    this_1.operandStack.push(this_1.locals[3].value);
                    break;
                }
                // lload_0
                case 0x1e: {
                    this_1.operandStack.push(this_1.locals[0].value);
                    break;
                }
                // lload_1
                case 0x1f: {
                    this_1.operandStack.push(this_1.locals[1].value);
                    break;
                }
                // lload_2
                case 0x20: {
                    this_1.operandStack.push(this_1.locals[2].value);
                    break;
                }
                // lload_3
                case 0x21: {
                    this_1.operandStack.push(this_1.locals[3].value);
                    break;
                }
                // fload_0
                case 0x22: {
                    this_1.operandStack.push(this_1.locals[0].value);
                    break;
                }
                // fload_1
                case 0x23: {
                    this_1.operandStack.push(this_1.locals[1].value);
                    break;
                }
                // fload_2
                case 0x24: {
                    this_1.operandStack.push(this_1.locals[2].value);
                    break;
                }
                // fload_3
                case 0x25: {
                    this_1.operandStack.push(this_1.locals[3].value);
                    break;
                }
                // dload_0
                case 0x26: {
                    this_1.operandStack.push(this_1.locals[0].value);
                    break;
                }
                // dload_1
                case 0x27: {
                    this_1.operandStack.push(this_1.locals[1].value);
                    break;
                }
                // dload_2
                case 0x28: {
                    this_1.operandStack.push(this_1.locals[2].value);
                    break;
                }
                // dload_3
                case 0x29: {
                    this_1.operandStack.push(this_1.locals[3].value);
                    break;
                }
                // aload_0
                case 0x2a: {
                    this_1.operandStack.push(this_1.locals[0].value);
                    break;
                }
                // aload_1
                case 0x2b: {
                    this_1.operandStack.push(this_1.locals[1].value);
                    break;
                }
                // aload_2
                case 0x2c: {
                    this_1.operandStack.push(this_1.locals[2].value);
                    break;
                }
                // aload_3
                case 0x2d: {
                    this_1.operandStack.push(this_1.locals[3].value);
                    break;
                }
                // iaload
                case 0x2e:
                // laload
                case 0x2f:
                // faload
                case 0x30:
                // daload
                case 0x31:
                // aaload
                case 0x32:
                // baload
                case 0x33:
                // caload
                case 0x34:
                // saload
                case 0x35: {
                    var index_7 = this_1.operandStack.pop();
                    var array = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.runtimeDataArea.objectHeap[array.heapIndex][index_7]);
                    break;
                }
                // istore
                case 0x36: {
                    var index_8 = this_1.opcode.operands[0];
                    this_1.locals[index_8] = new types_1.JavaVariable("java.lang.Integer", this_1.operandStack.pop());
                    break;
                }
                // lstore
                case 0x37: {
                    var index_9 = this_1.opcode.operands[0];
                    this_1.locals[index_9] = new types_1.JavaVariable("java.lang.Long", this_1.operandStack.pop());
                    break;
                }
                // fstore
                case 0x38: {
                    var index_10 = this_1.opcode.operands[0];
                    this_1.locals[index_10] = new types_1.JavaVariable("java.lang.Float", this_1.operandStack.pop());
                    break;
                }
                // dstore
                case 0x39: {
                    var index_11 = this_1.opcode.operands[0];
                    this_1.locals[index_11] = new types_1.JavaVariable("java.lang.Double", this_1.operandStack.pop());
                    break;
                }
                // astore
                case 0x3a: {
                    var index_12 = this_1.opcode.operands[0];
                    var obj = this_1.operandStack.pop();
                    this_1.locals[index_12] = new types_1.JavaVariable(obj == null ? null : obj.type.name, obj);
                    break;
                }
                // istore_0
                case 0x3b: {
                    this_1.locals[0] = new types_1.JavaVariable("java.lang.Integer", this_1.operandStack.pop());
                    break;
                }
                // istore_1
                case 0x3c: {
                    this_1.locals[1] = new types_1.JavaVariable("java.lang.Integer", this_1.operandStack.pop());
                    break;
                }
                // istore_2
                case 0x3d: {
                    this_1.locals[2] = new types_1.JavaVariable("java.lang.Integer", this_1.operandStack.pop());
                    break;
                }
                // istore_3
                case 0x3e: {
                    this_1.locals[3] = new types_1.JavaVariable("java.lang.Integer", this_1.operandStack.pop());
                    break;
                }
                // lstore_0
                case 0x3f: {
                    this_1.locals[0] = new types_1.JavaVariable("java.lang.Long", this_1.operandStack.pop());
                    break;
                }
                // lstore_1
                case 0x40: {
                    this_1.locals[1] = new types_1.JavaVariable("java.lang.Long", this_1.operandStack.pop());
                    break;
                }
                // lstore_2
                case 0x41: {
                    this_1.locals[2] = new types_1.JavaVariable("java.lang.Long", this_1.operandStack.pop());
                    break;
                }
                // lstore_3
                case 0x42: {
                    this_1.locals[3] = new types_1.JavaVariable("java.lang.Long", this_1.operandStack.pop());
                    break;
                }
                // fstore_0
                case 0x43: {
                    this_1.locals[0] = new types_1.JavaVariable("java.lang.Float", this_1.operandStack.pop());
                    break;
                }
                // fstore_1
                case 0x44: {
                    this_1.locals[1] = new types_1.JavaVariable("java.lang.Float", this_1.operandStack.pop());
                    break;
                }
                // fstore_2
                case 0x45: {
                    this_1.locals[2] = new types_1.JavaVariable("java.lang.Float", this_1.operandStack.pop());
                    break;
                }
                // fstore_3
                case 0x46: {
                    this_1.locals[3] = new types_1.JavaVariable("java.lang.Float", this_1.operandStack.pop());
                    break;
                }
                // dstore_0
                case 0x47: {
                    this_1.locals[0] = new types_1.JavaVariable("java.lang.Double", this_1.operandStack.pop());
                    break;
                }
                // dstore_1
                case 0x48: {
                    this_1.locals[1] = new types_1.JavaVariable("java.lang.Double", this_1.operandStack.pop());
                    break;
                }
                // dstore_2
                case 0x48: {
                    this_1.locals[2] = new types_1.JavaVariable("java.lang.Double", this_1.operandStack.pop());
                    break;
                }
                // dstore_3
                case 0x4a: {
                    this_1.locals[3] = new types_1.JavaVariable("java.lang.Double", this_1.operandStack.pop());
                    break;
                }
                // astore_0
                case 0x4b: {
                    var obj = this_1.operandStack.pop();
                    this_1.locals[0] = new types_1.JavaVariable(obj == null ? null : obj.type.name, obj);
                    break;
                }
                // astore_1
                case 0x4c: {
                    var obj = this_1.operandStack.pop();
                    this_1.locals[1] = new types_1.JavaVariable(obj == null ? null : obj.type.name, obj);
                    break;
                }
                // astore_2
                case 0x4d: {
                    var obj = this_1.operandStack.pop();
                    this_1.locals[2] = new types_1.JavaVariable(obj == null ? null : obj.type.name, obj);
                    break;
                }
                // astore_3
                case 0x4e: {
                    var obj = this_1.operandStack.pop();
                    this_1.locals[3] = new types_1.JavaVariable(obj == null ? null : obj.type.name, obj);
                    break;
                }
                // iastore
                case 0x4f:
                // lastore
                case 0x50:
                // fastore
                case 0x51:
                // dastore
                case 0x52:
                // aastore
                case 0x53:
                // bastore
                case 0x54:
                // castore
                case 0x55:
                // sastore
                case 0x56: {
                    var value = this_1.operandStack.pop();
                    var index_13 = this_1.operandStack.pop();
                    var array = this_1.operandStack.pop();
                    this_1.runtimeDataArea.objectHeap[array.heapIndex][index_13] = value;
                    // array[index] = value;
                    break;
                }
                // pop
                case 0x57: {
                    this_1.operandStack.pop();
                    break;
                }
                // pop2
                case 0x58: {
                    // TODO
                    var isCategory1 = function (data) { return data instanceof types_1.JavaVariable || data instanceof types_1.JavaVariable; };
                    var isCategory2 = function (data) { return data instanceof types_1.JavaVariable || data instanceof types_1.JavaVariable; };
                    var value1 = this_1.operandStack.pop();
                    if (isCategory2(value1))
                        break;
                    else if (isCategory1(value1)) {
                        var value2 = this_1.operandStack.pop();
                        if (isCategory1(value2))
                            break;
                        else {
                            console.error("Illegal operation: pop2 with category 1.");
                            return { value: void 0 };
                        }
                    }
                    break;
                }
                // dup
                case 0x59: {
                    var original = this_1.operandStack.pop();
                    if (original == null) {
                        this_1.operandStack.push(null);
                        this_1.operandStack.push(null);
                        break;
                    }
                    if (typeof original == "number") {
                        this_1.operandStack.push(original);
                        this_1.operandStack.push(original);
                        break;
                    }
                    var copied = Object.assign(Object.create(Object.getPrototypeOf(original)), original);
                    var copied2 = Object.assign(Object.create(Object.getPrototypeOf(original)), original);
                    this_1.operandStack.push(copied);
                    this_1.operandStack.push(copied2);
                    break;
                }
                // dup_x1
                case 0x5a: {
                    var value1 = this_1.operandStack.pop();
                    var value2 = this_1.operandStack.pop();
                    if (value1 == null) {
                        this_1.operandStack.push(null);
                        this_1.operandStack.push(value2);
                        this_1.operandStack.push(null);
                        break;
                    }
                    if (typeof value1 == "number") {
                        this_1.operandStack.push(value1);
                        this_1.operandStack.push(value2);
                        this_1.operandStack.push(value1);
                        break;
                    }
                    var copied = Object.assign(Object.create(Object.getPrototypeOf(value1)), value1);
                    var copied2 = Object.assign(Object.create(Object.getPrototypeOf(value1)), value1);
                    this_1.operandStack.push(copied);
                    this_1.operandStack.push(value2);
                    this_1.operandStack.push(copied2);
                    break;
                }
                // iadd
                case 0x60: {
                    this_1.operandStack.push(this_1.operandStack.pop() + this_1.operandStack.pop());
                    break;
                }
                // ladd
                case 0x61: {
                    this_1.operandStack.push(this_1.operandStack.pop() + this_1.operandStack.pop());
                    break;
                }
                // fadd
                case 0x62: {
                    this_1.operandStack.push(this_1.operandStack.pop() + this_1.operandStack.pop());
                    break;
                }
                // dadd
                case 0x63: {
                    this_1.operandStack.push(this_1.operandStack.pop() + this_1.operandStack.pop());
                    break;
                }
                // isub
                case 0x64: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 - value2);
                    break;
                }
                // lsub
                case 0x65: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() - value2);
                    break;
                }
                // fsub
                case 0x66: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() - value2);
                    break;
                }
                // dsub
                case 0x67: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() - value2);
                    break;
                }
                // imul
                case 0x68: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() * value2);
                    break;
                }
                // lmul
                case 0x69: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() * value2);
                    break;
                }
                // fmul
                case 0x6a: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() * value2);
                    break;
                }
                // dmul
                case 0x6b: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() * value2);
                    break;
                }
                // idiv
                case 0x6c: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() / value2);
                    break;
                }
                // ldiv
                case 0x6d: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() / value2);
                    break;
                }
                // fdiv
                case 0x6e: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() / value2);
                    break;
                }
                // ddiv
                case 0x6f: {
                    var value2 = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.operandStack.pop() / value2);
                    break;
                }
                // irem
                case 0x70: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 % value2);
                    break;
                }
                // lrem
                case 0x71: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 % value2);
                    break;
                }
                // frem
                case 0x72: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 % value2);
                    break;
                }
                // drem
                case 0x73: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 % value2);
                    break;
                }
                // ineg
                case 0x74: {
                    this_1.operandStack.push(-this_1.operandStack.pop());
                    break;
                }
                // lneg
                case 0x75: {
                    this_1.operandStack.push(-this_1.operandStack.pop());
                    break;
                }
                // fneg
                case 0x76: {
                    this_1.operandStack.push(-this_1.operandStack.pop());
                    break;
                }
                // dneg
                case 0x77: {
                    this_1.operandStack.push(-this_1.operandStack.pop());
                    break;
                }
                // ishl
                case 0x78: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 << value2);
                    break;
                }
                // lshl
                case 0x79: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 << value2);
                    break;
                }
                // ishr
                case 0x7a: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 >> value2);
                    break;
                }
                // lshr
                case 0x7b: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 >> value2);
                    break;
                }
                // iushr
                case 0x7c: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 >> value2);
                    break;
                }
                // lushr
                case 0x7d: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 >> value2);
                    break;
                }
                // iand
                case 0x7e: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 & value2);
                    break;
                }
                // land
                case 0x7f: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 & value2);
                    break;
                }
                // ior
                case 0x80: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 | value2);
                    break;
                }
                // lor
                case 0x81: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 | value2);
                    break;
                }
                // ixor
                case 0x82: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 ^ value2);
                    break;
                }
                // lxor
                case 0x83: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    this_1.operandStack.push(value1 ^ value2);
                    break;
                }
                // iinc
                case 0x84: {
                    var index_14 = this_1.opcode.operands[0];
                    var vConst = this_1.opcode.operands[1];
                    this_1.locals[index_14].value = this_1.locals[index_14].value + vConst;
                    break;
                }
                // i2l~i2s
                // TypeScript has only number type so these operation don't have any effects.
                case 0x85:
                case 0x86:
                case 0x87:
                case 0x88:
                case 0x89:
                case 0x8a:
                case 0x8b:
                case 0x8c:
                case 0x8d:
                case 0x8e:
                case 0x8f:
                case 0x90:
                case 0x91:
                case 0x92:
                case 0x93:
                    break;
                // lcmp
                case 0x94: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (value2 < value1)
                        this_1.operandStack.push(1);
                    else if (value2 == value1)
                        this_1.operandStack.push(0);
                    else
                        this_1.operandStack.push(-1);
                    break;
                }
                // fcmpl
                case 0x95: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (isNaN(value1) || isNaN(value2))
                        this_1.operandStack.push(-1);
                    else if (value2 < value1)
                        this_1.operandStack.push(1);
                    else if (value2 == value1)
                        this_1.operandStack.push(0);
                    else
                        this_1.operandStack.push(-1);
                    break;
                }
                // fcmpg
                case 0x96: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (isNaN(value1) || isNaN(value2))
                        this_1.operandStack.push(-1);
                    else if (value2 < value1)
                        this_1.operandStack.push(1);
                    else if (value2 == value1)
                        this_1.operandStack.push(0);
                    else
                        this_1.operandStack.push(1);
                    break;
                }
                // dcmpl
                case 0x97: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (isNaN(value1) || isNaN(value2))
                        this_1.operandStack.push(-1);
                    else if (value2 < value1)
                        this_1.operandStack.push(1);
                    else if (value2 == value1)
                        this_1.operandStack.push(0);
                    else
                        this_1.operandStack.push(-1);
                    break;
                }
                // dcmpg
                case 0x98: {
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (isNaN(value1) || isNaN(value2))
                        this_1.operandStack.push(-1);
                    else if (value2 < value1)
                        this_1.operandStack.push(1);
                    else if (value2 == value1)
                        this_1.operandStack.push(0);
                    else
                        this_1.operandStack.push(1);
                    break;
                }
                // ifeq
                case 0x99: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var a = this_1.operandStack.pop();
                    if (a === 0 || !a) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // ifne
                case 0x9a: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    if (this_1.operandStack.pop() !== 0) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // iflt
                case 0x9b: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    if (this_1.operandStack.pop() < 0) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // ifge
                case 0x9c: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    if (this_1.operandStack.pop() >= 0) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // ifgt
                case 0x9d: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    if (this_1.operandStack.pop() > 0) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // ifle
                case 0x9e: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    if (this_1.operandStack.pop() <= 0) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // if_icmpeq
                case 0x9f: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (value1 === value2) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // if_icmpne
                case 0xa0: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (value1 !== value2) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // if_icmplt
                case 0xa1: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (value1 < value2) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // if_icmpge
                case 0xa2: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (value1 >= value2) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // if_icmpgt
                case 0xa3: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (value1 > value2) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // if_icmple
                case 0xa4: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if (value1 <= value2) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // if_acmpeq
                case 0xa5: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if ((value1 == null && value2 == null)) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    if ((value1 != null && value2 == null) || (value1 == null && value2 != null)) {
                        break;
                    }
                    // TODO
                    if (value1.type.name === "java.lang.String" && value2.type.name === "java.lang.String") {
                        var hash1 = this_1.runtimeDataArea.objectHeap[value1.heapIndex].filter(function (v) { return v.name === "hash"; })[0].value;
                        var hash2 = this_1.runtimeDataArea.objectHeap[value2.heapIndex].filter(function (v) { return v.name === "hash"; })[0].value;
                        if (hash1 === hash2) {
                            return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                        }
                    }
                    if (value1.type.name === value2.type.name) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // if_acmpne
                case 0xa6: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var value2 = this_1.operandStack.pop();
                    var value1 = this_1.operandStack.pop();
                    if ((value1 == null && value2 == null))
                        break;
                    if ((value1 != null && value2 == null) || (value1 == null && value2 != null)) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    // TODO
                    if (value1.type.name === "java.lang.String" && value2.type.name === "java.lang.String") {
                        var hash1 = this_1.runtimeDataArea.objectHeap[value1.heapIndex].filter(function (v) { return v.name === "hash"; })[0].value;
                        var hash2 = this_1.runtimeDataArea.objectHeap[value2.heapIndex].filter(function (v) { return v.name === "hash"; })[0].value;
                        if (hash1 !== hash2) {
                            return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                        }
                    }
                    /*
                    console.log(value1, value2)
                    if (value1.type.name !== value2.type.name) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }

                     */
                    // TODO
                    if (value1.type.name == "java.lang.Class") {
                        var hashCode1 = JavaObject_1.JavaObject.hashCode(this_1.thread, this_1.javaClass, value1);
                        var hashCode2 = JavaObject_1.JavaObject.hashCode(this_1.thread, this_1.javaClass, value2);
                        if (hashCode1 !== hashCode2) {
                            return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                        }
                    }
                    else {
                        if (value1.type.name !== value2.type.name) {
                            return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                        }
                    }
                    break;
                }
                // goto
                case 0xa7: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                }
                // tableswitch
                case 0xaa: {
                    var def = this_1.opcode.operands[0];
                    var low = this_1.opcode.operands[1];
                    var high = this_1.opcode.operands[2];
                    var index_15 = this_1.operandStack.pop();
                    var newOperands = this_1.operandStack.reverse();
                    console.log(index_15, def, this_1.opcode.id + def, newOperands);
                    if (index_15 < low || high < index_15) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + def) };
                    }
                    else {
                        // TODO
                        console.log(index_15 - low, newOperands);
                        return { value: void 0 };
                    }
                    return { value: this_1.executeOpcodes(this_1.opcode.id + def) };
                }
                // lookupswitch
                case 0xab: {
                    var key = this_1.operandStack.pop();
                    var def = this_1.opcode.operands[0];
                    var npairs = this_1.opcode.operands[1];
                    for (var j = 2; j < npairs + 2; j++) {
                        if (this_1.opcode.operands[j] == key) {
                            return { value: this_1.executeOpcodes(this_1.opcode.id + this_1.opcode.operands[j + 1]) };
                        }
                    }
                    return { value: this_1.executeOpcodes(this_1.opcode.id + def) };
                }
                // ireturn
                case 0xac: {
                    this_1.isRunning = false;
                    return { value: this_1.operandStack.pop() };
                }
                // lreturn
                case 0xad: {
                    this_1.isRunning = false;
                    return { value: this_1.operandStack.pop() };
                }
                // freturn
                case 0xae: {
                    this_1.isRunning = false;
                    return { value: this_1.operandStack.pop() };
                }
                // dreturn
                case 0xaf: {
                    this_1.isRunning = false;
                    return { value: this_1.operandStack.pop() };
                }
                // areturn
                case 0xb0: {
                    this_1.isRunning = false;
                    return { value: this_1.operandStack.pop() };
                }
                // return
                case 0xb1: {
                    this_1.isRunning = false;
                    return { value: void 0 };
                }
                // invokespecial
                case 0xb7: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var methodRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                    var methodNameAndTypeRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, methodRef.nameAndTypeIndex).info;
                    var argumentsAndReturnType = (0, ClassFileLoader_js_1.getArgumentsAndReturnType)((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.descriptorIndex));
                    var descriptor = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.descriptorIndex);
                    var argumentsCount = argumentsAndReturnType[0].length;
                    var clazz = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, methodRef.classIndex).info;
                    var invokeMethodName = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.nameIndex).split("/").join(".");
                    var className = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, clazz.nameIndex).split("/").join(".");
                    var methodArgs = [];
                    for (var i_2 = 0; i_2 < argumentsCount; i_2++) {
                        methodArgs.push(this_1.operandStack.pop());
                    }
                    // TODO
                    if (className === "java.lang.ThreadLocal") {
                        this_1.operandStack.push(null);
                        break;
                    }
                    var obj = this_1.operandStack.pop();
                    var result = this_1.thread.invokeMethod(invokeMethodName, descriptor, BootstrapClassLoader_1.default.getInstance().findClass(className), methodArgs, obj);
                    if (result !== undefined) {
                        this_1.operandStack.push(result);
                    }
                    break;
                }
                // invokestatic
                case 0xb8: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var methodRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                    var methodNameAndTypeRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, methodRef.nameAndTypeIndex).info;
                    var descriptor = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.descriptorIndex);
                    var clazz = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, methodRef.classIndex).info;
                    var className = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, clazz.nameIndex).split("/").join(".");
                    var invokeMethodName = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.nameIndex);
                    var argumentsAndReturnType = (0, ClassFileLoader_js_1.getArgumentsAndReturnType)((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.descriptorIndex));
                    var argumentsCount = argumentsAndReturnType[0].length;
                    var methodArgs = [];
                    // TODO
                    if (invokeMethodName == "newUpdater") {
                        this_1.operandStack.push(null);
                        break;
                    }
                    for (var i_3 = 0; i_3 < argumentsCount; i_3++) {
                        methodArgs.push(this_1.operandStack.pop());
                    }
                    // TODO
                    if (className == "java.lang.reflect.Modifier") {
                        var klass = BootstrapClassLoader_1.default.getInstance().findClass(className.split("/").join("."));
                        klass.initStatic(this_1.thread);
                    }
                    var result = this_1.thread.invokeMethod(invokeMethodName, descriptor, BootstrapClassLoader_1.default.getInstance().findClass(className), methodArgs, null);
                    if (result !== undefined) {
                        this_1.operandStack.push(result);
                    }
                    break;
                }
                // invokeinterface
                case 0xb9: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var methodRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                    var methodNameAndTypeRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, methodRef.nameAndTypeIndex).info;
                    var descriptor = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.descriptorIndex);
                    var invokeMethodName = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.nameIndex);
                    var argumentsAndReturnType = (0, ClassFileLoader_js_1.getArgumentsAndReturnType)((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, methodNameAndTypeRef.descriptorIndex));
                    var argumentsCount = argumentsAndReturnType[0].length;
                    var methodArgs = [];
                    for (var i_4 = 0; i_4 < argumentsCount; i_4++) {
                        methodArgs.push(this_1.operandStack.pop());
                    }
                    var obj = this_1.operandStack.pop();
                    var result = this_1.thread.invokeMethod(invokeMethodName, descriptor, obj.type, methodArgs, obj);
                    if (result !== undefined) {
                        this_1.operandStack.push(result);
                    }
                    break;
                }
                // invokedynamic
                case 0xba: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var invokeDynamicRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                    var bootstrapMethodAttr = this_1.javaClass.attributes.filter(function (attribute) { return (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(_this.constantPool, attribute.attributeNameIndex) == "BootstrapMethods"; })[0];
                    var bootstrapMethodRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, bootstrapMethodAttr.bootstrapMethods[invokeDynamicRef.bootstrapMethodAttrIndex].bootstrapMethodRef).info;
                    var bootstrapMethod = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, bootstrapMethodRef.referenceIndex).info;
                    var bootstrapMethodClass = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, bootstrapMethod.classIndex).info;
                    var nameAndTypeRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, invokeDynamicRef.nameAndTypeIndex).info;
                    var bootstrapNameAndTypeRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, bootstrapMethod.nameAndTypeIndex).info;
                    var implMethodHandle = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, bootstrapMethodAttr.bootstrapMethods[invokeDynamicRef.bootstrapMethodAttrIndex].bootstrapArguments[1]).info;
                    var implMethodNameAndType = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, implMethodHandle.referenceIndex).info.nameAndTypeIndex).info;
                    var caller = this_1.thread.invokeMethod("lookup", "()Ljava/lang/invoke/MethodHandles$Lookup;", BootstrapClassLoader_1.default.getInstance().findClass("java.lang.invoke.MethodHandles"), [], null);
                    console.log("A");
                    var invokedName = this_1.runtimeDataArea.createStringObject(this_1.thread, (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, nameAndTypeRef.nameIndex));
                    console.log("B");
                    var invokedType = this_1.runtimeDataArea.createObject("java.lang.invoke.MethodType");
                    var array = this_1.runtimeDataArea.createAArray("java.lang.Class", 0);
                    this_1.thread.invokeMethod("<init>", "([Ljava/lang/Class;Ljava/lang/Class;)V", invokedType.type, [
                        this_1.runtimeDataArea.createClassObject(this_1.thread, BootstrapClassLoader_1.default.getInstance().findClass("java.lang.Runnable")),
                        array
                    ], invokedType);
                    console.log("C");
                    var samMethodType = this_1.runtimeDataArea.createObject("java.lang.invoke.MethodType");
                    var array0 = this_1.runtimeDataArea.createAArray("java.lang.Class", 0);
                    this_1.thread.invokeMethod("<init>", "([Ljava/lang/Class;Ljava/lang/Class;)V", samMethodType.type, [
                        this_1.runtimeDataArea.createClassObject(this_1.thread, BootstrapClassLoader_1.default.getInstance().findClass("java.lang.Void")),
                        array0
                    ], samMethodType);
                    console.log("D");
                    var implMethod = this_1.thread.invokeMethod("findVirtual", "(Ljava/lang/Class;Ljava/lang/String;Ljava/lang/invoke/MethodType;)Ljava/lang/invoke/MethodHandle;", caller.type, [
                        invokedType,
                        this_1.runtimeDataArea.createStringObject(this_1.thread, (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, implMethodNameAndType.nameIndex)),
                        this_1.runtimeDataArea.createClassObject(this_1.thread, this_1.javaClass)
                    ], caller);
                    console.log("E");
                    var instantiatedMethodType = this_1.runtimeDataArea.createObject("java.lang.invoke.MethodType");
                    var array1 = this_1.runtimeDataArea.createAArray("java.lang.Class", 0);
                    this_1.thread.invokeMethod("<init>", "([Ljava/lang/Class;Ljava/lang/Class;)V", instantiatedMethodType.type, [
                        this_1.runtimeDataArea.createClassObject(this_1.thread, BootstrapClassLoader_1.default.getInstance().findClass("java.lang.Void")),
                        array1
                    ], instantiatedMethodType);
                    console.log("F");
                    var callSite = this_1.thread.invokeMethod((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, bootstrapNameAndTypeRef.nameIndex), (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, bootstrapNameAndTypeRef.descriptorIndex), BootstrapClassLoader_1.default.getInstance().findClass((0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, bootstrapMethodClass.nameIndex).split("/").join(".")), [caller, invokedName, invokedType, samMethodType, implMethod, instantiatedMethodType], null);
                    console.log("G");
                    break;
                }
                // new
                case 0xbb: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var classRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                    var className = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, classRef.nameIndex).split("/").join(".");
                    var object = this_1.runtimeDataArea.createObject(className);
                    object.init(this_1.runtimeDataArea);
                    this_1.operandStack.push(object);
                    break;
                }
                // newarray
                case 0xbc: {
                    var type = this_1.opcode.operands[0];
                    var count = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.runtimeDataArea.createPArray(type, count));
                    break;
                }
                // anewarray
                case 0xbd: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var classRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                    var className = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, classRef.nameIndex);
                    var count = this_1.operandStack.pop();
                    this_1.operandStack.push(this_1.runtimeDataArea.createAArray(className.split("/").join("."), count));
                    break;
                }
                // arraylength
                case 0xbe: {
                    var array = this_1.operandStack.pop();
                    if (!array.isArray) {
                        throw new Error("The stack values is not array object.");
                    }
                    this_1.operandStack.push(this_1.runtimeDataArea.objectHeap[array.heapIndex].length);
                    break;
                }
                // athrow
                case 0xbf: {
                    var throwable_1 = this_1.operandStack.pop();
                    if (throwable_1 == null) {
                        throwable_1 = this_1.runtimeDataArea.createObject("java.lang.NullPointerException");
                    }
                    var codeAttributes = this_1.method.attributes.filter(function (attribute) { return (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(_this.constantPool, attribute.attributeNameIndex) === "Code"; });
                    if (!codeAttributes || codeAttributes.length == 0) {
                        console.error("CodeAttribute does not exist!");
                        break;
                    }
                    var codeAttribute = codeAttributes[0];
                    var handlers = codeAttribute.exceptionTable.filter((function (value) {
                        if (value.catchType != 0) {
                            var catchType = _this.constantPool[value.catchType].info;
                            return value.startPc <= _this.opcode.id && _this.opcode.id <= value.endPc
                                && (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(_this.constantPool, catchType.nameIndex).split("/").join(".") === throwable_1.type.name;
                        }
                        else {
                            return value.startPc <= _this.opcode.id && _this.opcode.id <= value.endPc;
                        }
                    }));
                    if (handlers.length > 0) {
                        var handler = handlers[0];
                        var result = this_1.executeOpcodes(handler.handlerPc);
                        this_1.operandStack = [];
                        this_1.operandStack.push(throwable_1);
                        return { value: result };
                    }
                    break;
                }
                // checkcast
                case 0xc0: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var ref = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (branchByte1 << 8) | branchByte2);
                    // TODO
                    break;
                }
                // monitorenter
                case 0xc2: {
                    // TODO
                    this_1.operandStack.pop();
                    break;
                }
                // monitorexit
                case 0xc3: {
                    // TODO
                    this_1.operandStack.pop();
                    break;
                }
                // multianewarray
                case 0xc5: {
                    var indexByte1 = this_1.opcode.operands[0];
                    var indexByte2 = this_1.opcode.operands[1];
                    var classRef = (0, ClassFileLoader_js_1.getConstantPoolInfo)(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                    var className = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this_1.constantPool, classRef.nameIndex);
                    var dimension = this_1.opcode.operands[2];
                    var sizes = new Array(dimension);
                    for (var j = 0; j < dimension; j++) {
                        sizes[j] = this_1.operandStack.pop();
                    }
                    this_1.operandStack.push(this_1.runtimeDataArea.createMDArray(className.split("/").join("."), dimension, sizes));
                    break;
                }
                // ifnull
                case 0xc6: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var value = this_1.operandStack.pop();
                    if (value == null) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
                // ifnonnull
                case 0xc7: {
                    var branchByte1 = this_1.opcode.operands[0];
                    var branchByte2 = this_1.opcode.operands[1];
                    var value = this_1.operandStack.pop();
                    if (value) {
                        return { value: this_1.executeOpcodes(this_1.opcode.id + ((branchByte1 << 8) | branchByte2)) };
                    }
                    break;
                }
            }
        };
        var this_1 = this;
        for (var i = index; i < this.opcodes.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
            if (state_1 === "break")
                break;
        }
    };
    Frame.prototype.loadOpcodes = function () {
        var _this = this;
        var codeAttributes = this.method.attributes.filter(function (attribute) { return (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(_this.constantPool, attribute.attributeNameIndex) === "Code"; });
        if (!codeAttributes || codeAttributes.length == 0)
            return;
        var codeAttribute = codeAttributes[0];
        var code = codeAttribute.code;
        code.resetOffset();
        var name = (0, ConstantPoolInfo_js_1.readUtf8FromConstantPool)(this.constantPool, this.method.nameIndex);
        var opcode;
        var id = 0;
        while (code.offset < code.getLength()) {
            opcode = code.getUint8();
            if (name == "isMethodHandleInvokeName")
                console.log(id);
            switch (opcode) {
                // nop
                case 0x00: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // aconst_null
                case 0x01: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // getstatic
                case 0xb2: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // putstatic
                case 0xb3: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // getfield
                case 0xb4: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // putfield
                case 0xb5: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // ldc
                case 0x12: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // ldc_w
                case 0x13: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // ldc2_w
                case 0x14: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // invokevirtual
                case 0xb6: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // iconst_m1
                case 0x02: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iconst_0
                case 0x03: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iconst_1
                case 0x04: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iconst_2
                case 0x05: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iconst_3
                case 0x06: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iconst_4
                case 0x07: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iconst_5
                case 0x08: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lconst_0
                case 0x09: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lconst_1
                case 0x0a: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fconst_0
                case 0x0b: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fconst_1
                case 0x0c: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fconst_2
                case 0x0d: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dconst_0
                case 0x0e: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dconst_1
                case 0x0f: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // bipush
                case 0x10: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getInt8()]
                    });
                    id++;
                    break;
                }
                // sipush
                case 0x11: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // iload
                case 0x15: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // lload
                case 0x16: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // fload
                case 0x17: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // dload
                case 0x18: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // iload_0
                case 0x1a: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iload_1
                case 0x1b: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iload_2
                case 0x1c: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iload_3
                case 0x1d: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lload_0
                case 0x1e: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lload_1
                case 0x1f: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                case 0x19: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // lload_2
                case 0x20: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lload_3
                case 0x21: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fload_0
                case 0x22: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fload_1
                case 0x23: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fload_2
                case 0x24: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fload_3
                case 0x25: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dload_0
                case 0x26: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dload_1
                case 0x27: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dload_2
                case 0x28: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dload_3
                case 0x29: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // aload_0
                case 0x2a: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // aload_1
                case 0x2b: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // aload_2
                case 0x2c: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // aload_3
                case 0x2d: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iaload
                case 0x2e:
                // laload
                case 0x2f:
                // faload
                case 0x30:
                // daload
                case 0x31:
                // aaload
                case 0x32:
                // baload
                case 0x33:
                // caload
                case 0x34:
                // saload
                case 0x35: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // istore
                case 0x36: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // lstore
                case 0x37: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // fstore
                case 0x38: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // dstore
                case 0x39: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // astore
                case 0x3a: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // istore_0
                case 0x3b: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // istore_1
                case 0x3c: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // istore_2
                case 0x3d: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // istore_3
                case 0x3e: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lstore_0
                case 0x3f: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lstore_1
                case 0x40: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lstore_2
                case 0x41: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lstore_3
                case 0x42: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fstore_0
                case 0x43: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fstore_1
                case 0x44: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fstore_2
                case 0x45: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fstore_3
                case 0x46: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dstore_0
                case 0x47: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dstore_1
                case 0x48: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dstore_2
                case 0x49: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dstore_3
                case 0x4a: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // astore_0
                case 0x4b: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // astore_1
                case 0x4c: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // astore_2
                case 0x4d: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // astore_3
                case 0x4e: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iastore
                case 0x4f:
                // lastore
                case 0x50:
                // fastore
                case 0x51:
                // dastore
                case 0x52:
                // aastore
                case 0x53:
                // bastore
                case 0x54:
                // castore
                case 0x55:
                // sastore
                case 0x56: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // pop
                case 0x57: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // pop2
                case 0x58: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dup
                case 0x59: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dup_x1
                case 0x5a: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iadd
                case 0x60: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // ladd
                case 0x61: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fadd
                case 0x62: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dadd
                case 0x63: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // isub
                case 0x64: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lsub
                case 0x65: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fsub
                case 0x66: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dsub
                case 0x67: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // imul
                case 0x68: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lmul
                case 0x69: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fmul
                case 0x6a: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dmul
                case 0x6b: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // idiv
                case 0x6c: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // ldiv
                case 0x6d: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fdiv
                case 0x6e: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // ddiv
                case 0x6f: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // irem
                case 0x70: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lrem
                case 0x71: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // frem
                case 0x72: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // drem
                case 0x73: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // ineg
                case 0x74: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lneg
                case 0x75: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fneg
                case 0x76: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dneg
                case 0x77: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // ishl
                case 0x78: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lshl
                case 0x79: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // ishr
                case 0x7a: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lshr
                case 0x7b: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iushr
                case 0x7c: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lushr
                case 0x7d: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iand
                case 0x7e: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // land
                case 0x7f: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // ior
                case 0x80: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lor
                case 0x81: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // ixor
                case 0x82: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lxor
                case 0x83: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // iinc
                case 0x84: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getInt8()]
                    });
                    id += 2;
                    break;
                }
                // i2l~i2s
                // TypeScript has only number type so these operation don't have any effects.
                case 0x85:
                case 0x86:
                case 0x87:
                case 0x88:
                case 0x89:
                case 0x8a:
                case 0x8b:
                case 0x8c:
                case 0x8d:
                case 0x8e:
                case 0x8f:
                case 0x90:
                case 0x91:
                case 0x92:
                case 0x93: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lcmp
                case 0x94: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fcmpl
                case 0x95: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // fcmpg
                case 0x96: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dcmpl
                case 0x97: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dcmpg
                case 0x98: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // ifeq
                case 0x99: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // ifne
                case 0x9a: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // iflt
                case 0x9b: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // ifge
                case 0x9c: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // ifgt
                case 0x9d: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // ifle
                case 0x9e: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // if_icmpeq
                case 0x9f: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // if_icmpne
                case 0xa0: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // if_icmplt
                case 0xa1: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // if_icmpge
                case 0xa2: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // if_icmpgt
                case 0xa3: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // if_icmple
                case 0xa4: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // if_acmpeq
                case 0xa5: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // if_acmpne
                case 0xa6: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // goto
                case 0xa7: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // tableswitch
                case 0xaa: {
                    var padding = (4 - (id + 1) % 4) % 4;
                    var operands = [];
                    var count = padding;
                    for (var i = 0; i < padding; i++) {
                        code.getUint8(); // padding
                    }
                    // defaultByte
                    var defaultNum = (code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8();
                    count += 4;
                    // lowByte
                    var lowNum = (code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8();
                    count += 4;
                    // highByte
                    var highNum = (code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8();
                    count += 4;
                    var n = highNum - lowNum + 1;
                    operands.push(defaultNum, lowNum, highNum);
                    // jump offsets
                    for (var i = 0; i < n; i++) {
                        // match
                        operands.push((code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8());
                        count += 4;
                    }
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: operands
                    });
                    id += count;
                    break;
                }
                // lookupswitch
                case 0xab: {
                    var padding = (4 - (id + 1) % 4) % 4;
                    var operands = [];
                    var count = padding;
                    for (var i = 0; i < padding; i++) {
                        code.getUint8(); // padding
                    }
                    // defaultByte
                    operands.push((code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8());
                    count += 4;
                    // npairs
                    operands.push((code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8());
                    count += 4;
                    // match-offset pairs
                    for (var i = 0; i < operands[1]; i++) {
                        // match
                        operands.push((code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8());
                        count += 4;
                        // offset
                        operands.push((code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8());
                        count += 4;
                    }
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: operands
                    });
                    id += count;
                    break;
                }
                // ireturn
                case 0xac: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // lreturn
                case 0xad: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // freturn
                case 0xae: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // dreturn
                case 0xaf: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // areturn
                case 0xb0: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // return
                case 0xb1: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // invokespecial
                case 0xb7: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // invokestatic
                case 0xb8: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // invokeinterface
                case 0xb9: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8(), code.getUint8(), code.getUint8()]
                    });
                    id += 4;
                    break;
                }
                // invokedynamic
                case 0xba: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8(), code.getUint8(), code.getUint8()]
                    });
                    id += 4;
                    break;
                }
                // new
                case 0xbb: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // newarray
                case 0xbc: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8()]
                    });
                    id++;
                    break;
                }
                // anewarray
                case 0xbd: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // arraylength
                case 0xbe: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // athrow
                case 0xbf: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // checkcast
                case 0xc0: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // monitorenter
                case 0xc2: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // monitorexit
                case 0xc3: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: []
                    });
                    break;
                }
                // multianewarray
                case 0xc5: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8(), code.getUint8()]
                    });
                    id += 3;
                    break;
                }
                // ifnull
                case 0xc6: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
                // ifnonnull
                case 0xc7: {
                    this.opcodes.push({
                        id: id,
                        opcode: opcode,
                        operands: [code.getUint8(), code.getUint8()]
                    });
                    id += 2;
                    break;
                }
            }
            id++;
        }
    };
    Frame.prototype.getClassName = function (packageName) {
        var split = packageName.split("/");
        return split[split.length - 1];
    };
    Frame.prototype.getOpcodeIndexById = function (id) {
        return this.opcodes.findIndex(function (opcode) { return opcode.id === id; });
    };
    Frame.prototype.getOpcodeById = function (id) {
        return this.opcodes.filter(function (opcode) { return opcode.id === id; })[0];
    };
    return Frame;
}());
exports.Frame = Frame;
//# sourceMappingURL=Frame.js.map