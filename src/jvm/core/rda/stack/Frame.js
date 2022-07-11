var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { CONSTANT_DOUBLE, CONSTANT_FLOAT, CONSTANT_INTEGER, CONSTANT_LONG, CONSTANT_STRING, isConstantFieldRefInfo, readUtf8FromConstantPool } from "../../../models/info/ConstantPoolInfo.js";
import { AnyVariable, DoubleVariable, FloatVariable, IntVariable, LongVariable } from "../../../models/Variable.js";
import { NoSuchFieldError } from "../../../lib/java/lang/NoSuchFieldError.js";
import { ByteBuffer } from "../../../utils/ByteBuffer.js";
import { System } from "../../../lib/java/lang/System.js";
import { throwErrorOrException } from "../../../jvm.js";
import { getConstantPoolInfo, getArgumentsAndReturnType } from "../../cfl/ClassFileLoader.js";
var Frame = /** @class */ (function () {
    function Frame(thread, method, classFile, localSize, constantPool, args) {
        var _this = this;
        this.operandStack = [];
        this.opcodes = new Array();
        this.isRunning = true;
        this.thread = thread;
        this.method = method;
        this.classFile = classFile;
        this.locals = new Array(localSize);
        this.constantPool = constantPool;
        args.forEach(function (arg) { return _this.locals.push(new IntVariable(arg)); });
    }
    Frame.prototype.execute = function () {
        this.executeOpcodes(0);
    };
    Frame.prototype.executeOpcodes = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var opcode, index, _loop_1, this_1, i, state_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.opcodes[this.opcodes.length - 1].id < id) {
                            id = id - 65536;
                        }
                        index = this.getOpcodeIndexById(id);
                        _loop_1 = function (i) {
                            var _b, indexByte1, indexByte2, constantPoolInfo, fieldRef, classRef, fieldNameAndTypeRef, module_1, fieldClassFileName, index_1, info, dataView, dataView, indexByte1, indexByte2, info, dataView, dataView, indexByte1, indexByte2, methodRef, methodNameAndTypeRef, clazz, className, invokeMethodName, argumentsAndReturnType, methodArgs, i_1, result, data, index_2, index_3, index_4, index_5, index_6, index_7, array, index_8, index_9, index_10, index_11, index_12, value, index_13, array, data, isCategory1, isCategory2, value1, value2, original, copied, copied2, value2, value2, value2, value2, value2, value2, value2, value2, value2, value2, value2, value2, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, index_14, vConst, value2, value1, value2, value1, value2, value1, value2, value1, value2, value1, branchByte1, branchByte2, branchByte1, branchByte2, branchByte1, branchByte2, branchByte1, branchByte2, branchByte1, branchByte2, branchByte1, branchByte2, branchByte1, branchByte2, value2, value1, branchByte1, branchByte2, value2, value1, branchByte1, branchByte2, value2, value1, branchByte1, branchByte2, value2, value1, branchByte1, branchByte2, value2, value1, branchByte1, branchByte2, value2, value1, branchByte1, branchByte2, indexByte1, indexByte2, methodRef, methodNameAndTypeRef, argumentsAndReturnType, argumentsCount, methodArgs, i_2, indexByte1, indexByte2, methodRef, methodNameAndTypeRef, clazz, className, invokeMethodName, argumentsAndReturnType, argumentsCount, methodArgs, i_3, module_2, e_1, indexByte1, indexByte2, classRef, className, module_3, type, count, array, branchByte1, branchByte2, count, branchByte1, branchByte2, dimension, createMultiDimensionalArray_1, branchByte1, branchByte2, ref, branchByte1, branchByte2, value, branchByte1, branchByte2, value;
                            var _c, _d, _e, _f;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        opcode = this_1.opcodes[i];
                                        if (!this_1.isRunning || !opcode)
                                            return [2 /*return*/, "break"];
                                        _b = opcode.opcode;
                                        switch (_b) {
                                            case 0x00: return [3 /*break*/, 1];
                                            case 0xb2: return [3 /*break*/, 2];
                                            case 0x12: return [3 /*break*/, 4];
                                            case 0x14: return [3 /*break*/, 5];
                                            case 0xb6: return [3 /*break*/, 6];
                                            case 0x02: return [3 /*break*/, 7];
                                            case 0x03: return [3 /*break*/, 8];
                                            case 0x04: return [3 /*break*/, 9];
                                            case 0x05: return [3 /*break*/, 10];
                                            case 0x06: return [3 /*break*/, 11];
                                            case 0x07: return [3 /*break*/, 12];
                                            case 0x08: return [3 /*break*/, 13];
                                            case 0x09: return [3 /*break*/, 14];
                                            case 0x0a: return [3 /*break*/, 15];
                                            case 0x0b: return [3 /*break*/, 16];
                                            case 0x0c: return [3 /*break*/, 17];
                                            case 0x0d: return [3 /*break*/, 18];
                                            case 0x0e: return [3 /*break*/, 19];
                                            case 0x0f: return [3 /*break*/, 20];
                                            case 0x10: return [3 /*break*/, 21];
                                            case 0x15: return [3 /*break*/, 22];
                                            case 0x16: return [3 /*break*/, 23];
                                            case 0x17: return [3 /*break*/, 24];
                                            case 0x18: return [3 /*break*/, 25];
                                            case 0x19: return [3 /*break*/, 26];
                                            case 0x1a: return [3 /*break*/, 27];
                                            case 0x1b: return [3 /*break*/, 28];
                                            case 0x1c: return [3 /*break*/, 29];
                                            case 0x1d: return [3 /*break*/, 30];
                                            case 0x1e: return [3 /*break*/, 31];
                                            case 0x1f: return [3 /*break*/, 32];
                                            case 0x20: return [3 /*break*/, 33];
                                            case 0x21: return [3 /*break*/, 34];
                                            case 0x22: return [3 /*break*/, 35];
                                            case 0x23: return [3 /*break*/, 36];
                                            case 0x24: return [3 /*break*/, 37];
                                            case 0x25: return [3 /*break*/, 38];
                                            case 0x26: return [3 /*break*/, 39];
                                            case 0x27: return [3 /*break*/, 40];
                                            case 0x28: return [3 /*break*/, 41];
                                            case 0x29: return [3 /*break*/, 42];
                                            case 0x2a: return [3 /*break*/, 43];
                                            case 0x2b: return [3 /*break*/, 44];
                                            case 0x2c: return [3 /*break*/, 45];
                                            case 0x2d: return [3 /*break*/, 46];
                                            case 0x2e: return [3 /*break*/, 47];
                                            case 0x2f: return [3 /*break*/, 47];
                                            case 0x30: return [3 /*break*/, 47];
                                            case 0x31: return [3 /*break*/, 47];
                                            case 0x32: return [3 /*break*/, 47];
                                            case 0x33: return [3 /*break*/, 47];
                                            case 0x34: return [3 /*break*/, 47];
                                            case 0x35: return [3 /*break*/, 47];
                                            case 0x36: return [3 /*break*/, 48];
                                            case 0x37: return [3 /*break*/, 49];
                                            case 0x38: return [3 /*break*/, 50];
                                            case 0x39: return [3 /*break*/, 51];
                                            case 0x3a: return [3 /*break*/, 52];
                                            case 0x3b: return [3 /*break*/, 53];
                                            case 0x3c: return [3 /*break*/, 54];
                                            case 0x3d: return [3 /*break*/, 55];
                                            case 0x3e: return [3 /*break*/, 56];
                                            case 0x3f: return [3 /*break*/, 57];
                                            case 0x40: return [3 /*break*/, 58];
                                            case 0x41: return [3 /*break*/, 59];
                                            case 0x42: return [3 /*break*/, 60];
                                            case 0x43: return [3 /*break*/, 61];
                                            case 0x44: return [3 /*break*/, 62];
                                            case 0x45: return [3 /*break*/, 63];
                                            case 0x46: return [3 /*break*/, 64];
                                            case 0x47: return [3 /*break*/, 65];
                                            case 0x48: return [3 /*break*/, 66];
                                            case 0x48: return [3 /*break*/, 67];
                                            case 0x4a: return [3 /*break*/, 68];
                                            case 0x4b: return [3 /*break*/, 69];
                                            case 0x4c: return [3 /*break*/, 70];
                                            case 0x4d: return [3 /*break*/, 71];
                                            case 0x4e: return [3 /*break*/, 72];
                                            case 0x4f: return [3 /*break*/, 73];
                                            case 0x50: return [3 /*break*/, 73];
                                            case 0x51: return [3 /*break*/, 73];
                                            case 0x52: return [3 /*break*/, 73];
                                            case 0x53: return [3 /*break*/, 73];
                                            case 0x54: return [3 /*break*/, 73];
                                            case 0x55: return [3 /*break*/, 73];
                                            case 0x56: return [3 /*break*/, 73];
                                            case 0x57: return [3 /*break*/, 74];
                                            case 0x58: return [3 /*break*/, 75];
                                            case 0x59: return [3 /*break*/, 76];
                                            case 0x60: return [3 /*break*/, 77];
                                            case 0x61: return [3 /*break*/, 78];
                                            case 0x62: return [3 /*break*/, 79];
                                            case 0x63: return [3 /*break*/, 80];
                                            case 0x64: return [3 /*break*/, 81];
                                            case 0x65: return [3 /*break*/, 82];
                                            case 0x66: return [3 /*break*/, 83];
                                            case 0x67: return [3 /*break*/, 84];
                                            case 0x68: return [3 /*break*/, 85];
                                            case 0x69: return [3 /*break*/, 86];
                                            case 0x6a: return [3 /*break*/, 87];
                                            case 0x6b: return [3 /*break*/, 88];
                                            case 0x6c: return [3 /*break*/, 89];
                                            case 0x6d: return [3 /*break*/, 90];
                                            case 0x6e: return [3 /*break*/, 91];
                                            case 0x6f: return [3 /*break*/, 92];
                                            case 0x70: return [3 /*break*/, 93];
                                            case 0x71: return [3 /*break*/, 94];
                                            case 0x72: return [3 /*break*/, 95];
                                            case 0x73: return [3 /*break*/, 96];
                                            case 0x74: return [3 /*break*/, 97];
                                            case 0x75: return [3 /*break*/, 98];
                                            case 0x76: return [3 /*break*/, 99];
                                            case 0x77: return [3 /*break*/, 100];
                                            case 0x78: return [3 /*break*/, 101];
                                            case 0x79: return [3 /*break*/, 102];
                                            case 0x7a: return [3 /*break*/, 103];
                                            case 0x7b: return [3 /*break*/, 104];
                                            case 0x7c: return [3 /*break*/, 105];
                                            case 0x7d: return [3 /*break*/, 106];
                                            case 0x7e: return [3 /*break*/, 107];
                                            case 0x7f: return [3 /*break*/, 108];
                                            case 0x80: return [3 /*break*/, 109];
                                            case 0x81: return [3 /*break*/, 110];
                                            case 0x82: return [3 /*break*/, 111];
                                            case 0x83: return [3 /*break*/, 112];
                                            case 0x84: return [3 /*break*/, 113];
                                            case 0x85: return [3 /*break*/, 114];
                                            case 0x86: return [3 /*break*/, 114];
                                            case 0x87: return [3 /*break*/, 114];
                                            case 0x88: return [3 /*break*/, 114];
                                            case 0x89: return [3 /*break*/, 114];
                                            case 0x8a: return [3 /*break*/, 114];
                                            case 0x8b: return [3 /*break*/, 114];
                                            case 0x8c: return [3 /*break*/, 114];
                                            case 0x8d: return [3 /*break*/, 114];
                                            case 0x8e: return [3 /*break*/, 114];
                                            case 0x8f: return [3 /*break*/, 114];
                                            case 0x90: return [3 /*break*/, 114];
                                            case 0x91: return [3 /*break*/, 114];
                                            case 0x92: return [3 /*break*/, 114];
                                            case 0x93: return [3 /*break*/, 114];
                                            case 0x94: return [3 /*break*/, 115];
                                            case 0x95: return [3 /*break*/, 116];
                                            case 0x96: return [3 /*break*/, 117];
                                            case 0x97: return [3 /*break*/, 118];
                                            case 0x98: return [3 /*break*/, 119];
                                            case 0x99: return [3 /*break*/, 120];
                                            case 0x9a: return [3 /*break*/, 123];
                                            case 0x9b: return [3 /*break*/, 126];
                                            case 0x9c: return [3 /*break*/, 129];
                                            case 0x9d: return [3 /*break*/, 132];
                                            case 0x9e: return [3 /*break*/, 135];
                                            case 0x9f: return [3 /*break*/, 138];
                                            case 0xa0: return [3 /*break*/, 141];
                                            case 0xa1: return [3 /*break*/, 144];
                                            case 0xa2: return [3 /*break*/, 147];
                                            case 0xa3: return [3 /*break*/, 150];
                                            case 0xa4: return [3 /*break*/, 153];
                                            case 0xa7: return [3 /*break*/, 156];
                                            case 0xac: return [3 /*break*/, 158];
                                            case 0xb1: return [3 /*break*/, 159];
                                            case 0xb7: return [3 /*break*/, 160];
                                            case 0xb8: return [3 /*break*/, 161];
                                            case 0xbb: return [3 /*break*/, 166];
                                            case 0xbc: return [3 /*break*/, 168];
                                            case 0xbd: return [3 /*break*/, 169];
                                            case 0xbe: return [3 /*break*/, 170];
                                            case 0xc5: return [3 /*break*/, 171];
                                            case 0xc6: return [3 /*break*/, 172];
                                            case 0xc6: return [3 /*break*/, 173];
                                            case 0xc7: return [3 /*break*/, 176];
                                        }
                                        return [3 /*break*/, 179];
                                    case 1:
                                        {
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 2;
                                    case 2:
                                        indexByte1 = opcode.operands[0];
                                        indexByte2 = opcode.operands[1];
                                        constantPoolInfo = getConstantPoolInfo(this_1.constantPool, (indexByte1 << 8) | indexByte2);
                                        if (!constantPoolInfo || !isConstantFieldRefInfo(constantPoolInfo.info)) {
                                            throwErrorOrException(new NoSuchFieldError());
                                            return [2 /*return*/, { value: void 0 }];
                                        }
                                        fieldRef = constantPoolInfo.info;
                                        classRef = getConstantPoolInfo(this_1.constantPool, fieldRef.classIndex).info;
                                        fieldNameAndTypeRef = getConstantPoolInfo(this_1.constantPool, fieldRef.nameAndTypeIndex).info;
                                        return [4 /*yield*/, import("../../../lib/" + readUtf8FromConstantPool(this_1.constantPool, classRef.nameIndex) + ".js")];
                                    case 3:
                                        module_1 = _g.sent();
                                        fieldClassFileName = readUtf8FromConstantPool(this_1.constantPool, fieldNameAndTypeRef.nameIndex);
                                        this_1.operandStack.push(module_1[this_1.getClassName(readUtf8FromConstantPool(this_1.constantPool, classRef.nameIndex))][fieldClassFileName]);
                                        return [3 /*break*/, 179];
                                    case 4:
                                        {
                                            index_1 = opcode.operands[0];
                                            info = getConstantPoolInfo(this_1.constantPool, index_1).info;
                                            if (info.tag === CONSTANT_STRING) {
                                                this_1.operandStack.push(readUtf8FromConstantPool(this_1.constantPool, info.stringIndex));
                                            }
                                            else if (info.tag === CONSTANT_INTEGER) {
                                                dataView = new ByteBuffer(new ArrayBuffer(32));
                                                dataView.setInt32(info.bytes);
                                                dataView.resetOffset();
                                                this_1.operandStack.push(dataView.getInt8());
                                            }
                                            else if (info.tag === CONSTANT_FLOAT) {
                                                dataView = new ByteBuffer(new ArrayBuffer(32));
                                                dataView.setUint32(info.bytes);
                                                dataView.resetOffset();
                                                this_1.operandStack.push(dataView.getFloat32());
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 5;
                                    case 5:
                                        {
                                            indexByte1 = opcode.operands[0];
                                            indexByte2 = opcode.operands[1];
                                            info = getConstantPoolInfo(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                                            if (info.tag === CONSTANT_LONG) {
                                                dataView = new ByteBuffer(new ArrayBuffer(64));
                                                dataView.setUint32(info.highBytes);
                                                dataView.setUint32(info.lowBytes);
                                                dataView.resetOffset();
                                                this_1.operandStack.push((dataView.getUint32() << 32) + dataView.getUint32());
                                            }
                                            else if (info.tag === CONSTANT_DOUBLE) {
                                                dataView = new ByteBuffer(new ArrayBuffer(64));
                                                dataView.setUint32(info.highBytes);
                                                dataView.setUint32(info.lowBytes);
                                                dataView.resetOffset();
                                                this_1.operandStack.push(dataView.getFloat64());
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 6;
                                    case 6:
                                        {
                                            indexByte1 = opcode.operands[0];
                                            indexByte2 = opcode.operands[1];
                                            methodRef = getConstantPoolInfo(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                                            methodNameAndTypeRef = getConstantPoolInfo(this_1.constantPool, methodRef.nameAndTypeIndex).info;
                                            clazz = getConstantPoolInfo(this_1.constantPool, methodRef.classIndex).info;
                                            className = readUtf8FromConstantPool(this_1.constantPool, clazz.nameIndex);
                                            invokeMethodName = readUtf8FromConstantPool(this_1.constantPool, methodNameAndTypeRef.nameIndex);
                                            argumentsAndReturnType = getArgumentsAndReturnType(readUtf8FromConstantPool(this_1.constantPool, methodNameAndTypeRef.descriptorIndex));
                                            methodArgs = [];
                                            for (i_1 = 0; i_1 < argumentsAndReturnType[0].length; i_1++) {
                                                methodArgs.push(this_1.operandStack.pop());
                                            }
                                            if (argumentsAndReturnType[1] !== "V") {
                                                result = (_c = this_1.operandStack.pop())[invokeMethodName].apply(_c, methodArgs);
                                                if (typeof result === "object") {
                                                    this_1.operandStack.push(result);
                                                }
                                                else {
                                                    this_1.operandStack.push(result);
                                                }
                                            }
                                            else {
                                                (_d = this_1.operandStack.pop())[invokeMethodName].apply(_d, methodArgs);
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 7;
                                    case 7:
                                        {
                                            this_1.operandStack.push(-1);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 8;
                                    case 8:
                                        {
                                            this_1.operandStack.push(0);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 9;
                                    case 9:
                                        {
                                            this_1.operandStack.push(1);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 10;
                                    case 10:
                                        {
                                            this_1.operandStack.push(2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 11;
                                    case 11:
                                        {
                                            this_1.operandStack.push(3);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 12;
                                    case 12:
                                        {
                                            this_1.operandStack.push(4);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 13;
                                    case 13:
                                        {
                                            this_1.operandStack.push(5);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 14;
                                    case 14:
                                        {
                                            this_1.operandStack.push(1);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 15;
                                    case 15:
                                        {
                                            this_1.operandStack.push(2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 16;
                                    case 16:
                                        {
                                            this_1.operandStack.push(0.0);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 17;
                                    case 17:
                                        {
                                            this_1.operandStack.push(1.0);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 18;
                                    case 18:
                                        {
                                            this_1.operandStack.push(2.0);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 19;
                                    case 19:
                                        {
                                            this_1.operandStack.push(0.0);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 20;
                                    case 20:
                                        {
                                            this_1.operandStack.push(1.0);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 21;
                                    case 21:
                                        {
                                            data = opcode.operands[0];
                                            this_1.operandStack.push(data);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 22;
                                    case 22:
                                        {
                                            index_2 = opcode.operands[0];
                                            this_1.operandStack.push(this_1.locals[index_2].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 23;
                                    case 23:
                                        {
                                            index_3 = opcode.operands[0];
                                            this_1.operandStack.push(this_1.locals[index_3].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 24;
                                    case 24:
                                        {
                                            index_4 = opcode.operands[0];
                                            this_1.operandStack.push(this_1.locals[index_4].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 25;
                                    case 25:
                                        {
                                            index_5 = opcode.operands[0];
                                            this_1.operandStack.push(this_1.locals[index_5].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 26;
                                    case 26:
                                        {
                                            index_6 = opcode.operands[0];
                                            this_1.operandStack.push(this_1.locals[index_6].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 27;
                                    case 27:
                                        {
                                            this_1.operandStack.push(this_1.locals[0].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 28;
                                    case 28:
                                        {
                                            this_1.operandStack.push(this_1.locals[1].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 29;
                                    case 29:
                                        {
                                            this_1.operandStack.push(this_1.locals[2].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 30;
                                    case 30:
                                        {
                                            this_1.operandStack.push(this_1.locals[3].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 31;
                                    case 31:
                                        {
                                            this_1.operandStack.push(this_1.locals[0].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 32;
                                    case 32:
                                        {
                                            this_1.operandStack.push(this_1.locals[1].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 33;
                                    case 33:
                                        {
                                            this_1.operandStack.push(this_1.locals[2].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 34;
                                    case 34:
                                        {
                                            this_1.operandStack.push(this_1.locals[3].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 35;
                                    case 35:
                                        {
                                            this_1.operandStack.push(this_1.locals[0].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 36;
                                    case 36:
                                        {
                                            this_1.operandStack.push(this_1.locals[1].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 37;
                                    case 37:
                                        {
                                            this_1.operandStack.push(this_1.locals[2].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 38;
                                    case 38:
                                        {
                                            this_1.operandStack.push(this_1.locals[3].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 39;
                                    case 39:
                                        {
                                            this_1.operandStack.push(this_1.locals[0].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 40;
                                    case 40:
                                        {
                                            this_1.operandStack.push(this_1.locals[1].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 41;
                                    case 41:
                                        {
                                            this_1.operandStack.push(this_1.locals[2].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 42;
                                    case 42:
                                        {
                                            this_1.operandStack.push(this_1.locals[3].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 43;
                                    case 43:
                                        {
                                            this_1.operandStack.push(this_1.locals[0].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 44;
                                    case 44:
                                        {
                                            this_1.operandStack.push(this_1.locals[1].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 45;
                                    case 45:
                                        {
                                            this_1.operandStack.push(this_1.locals[2].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 46;
                                    case 46:
                                        {
                                            this_1.operandStack.push(this_1.locals[3].getValue());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 47;
                                    case 47:
                                        {
                                            index_7 = this_1.operandStack.pop();
                                            array = this_1.operandStack.pop();
                                            this_1.operandStack.push(array[index_7]);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 48;
                                    case 48:
                                        {
                                            index_8 = opcode.operands[0];
                                            if (this_1.locals.length - 1 < index_8) {
                                                this_1.locals.push(new IntVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(index_8, 0, new IntVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 49;
                                    case 49:
                                        {
                                            index_9 = opcode.operands[0];
                                            if (this_1.locals.length - 1 < index_9) {
                                                this_1.locals.push(new LongVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(index_9, 0, new LongVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 50;
                                    case 50:
                                        {
                                            index_10 = opcode.operands[0];
                                            if (this_1.locals.length - 1 < index_10) {
                                                this_1.locals.push(new FloatVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(index_10, 0, new FloatVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 51;
                                    case 51:
                                        {
                                            index_11 = opcode.operands[0];
                                            if (this_1.locals.length - 1 < index_11) {
                                                this_1.locals.push(new DoubleVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(index_11, 0, new DoubleVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 52;
                                    case 52:
                                        {
                                            index_12 = opcode.operands[0];
                                            if (this_1.locals.length - 1 < index_12) {
                                                this_1.locals.push(new AnyVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(index_12, 0, new AnyVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 53;
                                    case 53:
                                        {
                                            if (this_1.locals.length - 1 < 0) {
                                                this_1.locals.push(new IntVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(0, 0, new IntVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 54;
                                    case 54:
                                        {
                                            if (this_1.locals.length - 1 < 1) {
                                                this_1.locals.push(new IntVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(1, 0, new IntVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 55;
                                    case 55:
                                        {
                                            if (this_1.locals.length - 1 < 2) {
                                                this_1.locals.push(new IntVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(2, 0, new IntVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 56;
                                    case 56:
                                        {
                                            if (this_1.locals.length - 1 < 3) {
                                                this_1.locals.push(new IntVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(3, 0, new IntVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 57;
                                    case 57:
                                        {
                                            if (this_1.locals.length - 1 < 0) {
                                                this_1.locals.push(new LongVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(0, 0, new LongVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 58;
                                    case 58:
                                        {
                                            if (this_1.locals.length - 1 < 1) {
                                                this_1.locals.push(new LongVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(1, 0, new LongVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 59;
                                    case 59:
                                        {
                                            if (this_1.locals.length - 1 < 2) {
                                                this_1.locals.push(new LongVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(2, 0, new LongVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 60;
                                    case 60:
                                        {
                                            if (this_1.locals.length - 1 < 3) {
                                                this_1.locals.push(new LongVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(3, 0, new LongVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 61;
                                    case 61:
                                        {
                                            if (this_1.locals.length - 1 < 0) {
                                                this_1.locals.push(new FloatVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(0, 0, new FloatVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 62;
                                    case 62:
                                        {
                                            if (this_1.locals.length - 1 < 1) {
                                                this_1.locals.push(new FloatVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(1, 0, new FloatVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 63;
                                    case 63:
                                        {
                                            if (this_1.locals.length - 1 < 2) {
                                                this_1.locals.push(new FloatVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(2, 0, new FloatVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 64;
                                    case 64:
                                        {
                                            if (this_1.locals.length - 1 < 3) {
                                                this_1.locals.push(new FloatVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(3, 0, new FloatVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 65;
                                    case 65:
                                        {
                                            if (this_1.locals.length - 1 < 0) {
                                                this_1.locals.push(new DoubleVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(0, 0, new DoubleVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 66;
                                    case 66:
                                        {
                                            if (this_1.locals.length - 1 < 1) {
                                                this_1.locals.push(new DoubleVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(1, 0, new DoubleVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 67;
                                    case 67:
                                        {
                                            if (this_1.locals.length - 1 < 2) {
                                                this_1.locals.push(new DoubleVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(2, 0, new DoubleVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 68;
                                    case 68:
                                        {
                                            if (this_1.locals.length - 1 < 3) {
                                                this_1.locals.push(new DoubleVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(3, 0, new DoubleVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 69;
                                    case 69:
                                        {
                                            if (this_1.locals.length - 1 < 0) {
                                                this_1.locals.push(new AnyVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(0, 0, new AnyVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 70;
                                    case 70:
                                        {
                                            if (this_1.locals.length - 1 < 1) {
                                                this_1.locals.push(new AnyVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(1, 0, new AnyVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 71;
                                    case 71:
                                        {
                                            if (this_1.locals.length - 1 < 2) {
                                                this_1.locals.push(new AnyVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(2, 0, new AnyVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 72;
                                    case 72:
                                        {
                                            if (this_1.locals.length - 1 < 3) {
                                                this_1.locals.push(new AnyVariable(this_1.operandStack.pop()));
                                            }
                                            else {
                                                this_1.locals.splice(3, 0, new AnyVariable(this_1.operandStack.pop()));
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 73;
                                    case 73:
                                        {
                                            value = this_1.operandStack.pop();
                                            index_13 = this_1.operandStack.pop();
                                            array = this_1.operandStack.pop();
                                            array[index_13] = value;
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 74;
                                    case 74:
                                        {
                                            data = this_1.operandStack.pop();
                                            if (data instanceof DoubleVariable || data instanceof LongVariable) {
                                                System.err.println("Illegal operation: pop with category 2.");
                                                return [2 /*return*/, { value: void 0 }];
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 75;
                                    case 75:
                                        {
                                            isCategory1 = function (data) { return data instanceof IntVariable || data instanceof FloatVariable; };
                                            isCategory2 = function (data) { return data instanceof DoubleVariable || data instanceof LongVariable; };
                                            value1 = this_1.operandStack.pop();
                                            if (isCategory2(value1))
                                                return [3 /*break*/, 179];
                                            else if (isCategory1(value1)) {
                                                value2 = this_1.operandStack.pop();
                                                if (isCategory1(value2))
                                                    return [3 /*break*/, 179];
                                                else {
                                                    System.err.println("Illegal operation: pop2 with category 1.");
                                                    return [2 /*return*/, { value: void 0 }];
                                                }
                                            }
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 76;
                                    case 76:
                                        {
                                            original = this_1.operandStack.pop();
                                            copied = Object.assign(Object.create(Object.getPrototypeOf(original)), original);
                                            copied2 = Object.assign(Object.create(Object.getPrototypeOf(original)), original);
                                            this_1.operandStack.push(copied);
                                            this_1.operandStack.push(copied2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 77;
                                    case 77:
                                        {
                                            this_1.operandStack.push(this_1.operandStack.pop() + this_1.operandStack.pop());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 78;
                                    case 78:
                                        {
                                            this_1.operandStack.push(this_1.operandStack.pop() + this_1.operandStack.pop());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 79;
                                    case 79:
                                        {
                                            this_1.operandStack.push(this_1.operandStack.pop() + this_1.operandStack.pop());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 80;
                                    case 80:
                                        {
                                            this_1.operandStack.push(this_1.operandStack.pop() + this_1.operandStack.pop());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 81;
                                    case 81:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() - value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 82;
                                    case 82:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() - value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 83;
                                    case 83:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() - value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 84;
                                    case 84:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() - value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 85;
                                    case 85:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() * value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 86;
                                    case 86:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() * value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 87;
                                    case 87:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() * value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 88;
                                    case 88:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() * value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 89;
                                    case 89:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() / value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 90;
                                    case 90:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() / value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 91;
                                    case 91:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() / value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 92;
                                    case 92:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            this_1.operandStack.push(this_1.operandStack.pop() / value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 93;
                                    case 93:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 % value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 94;
                                    case 94:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 % value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 95;
                                    case 95:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 % value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 96;
                                    case 96:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 % value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 97;
                                    case 97:
                                        {
                                            this_1.operandStack.push(-this_1.operandStack.pop());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 98;
                                    case 98:
                                        {
                                            this_1.operandStack.push(-this_1.operandStack.pop());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 99;
                                    case 99:
                                        {
                                            this_1.operandStack.push(-this_1.operandStack.pop());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 100;
                                    case 100:
                                        {
                                            this_1.operandStack.push(-this_1.operandStack.pop());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 101;
                                    case 101:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 << value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 102;
                                    case 102:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 << value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 103;
                                    case 103:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 >> value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 104;
                                    case 104:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 >> value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 105;
                                    case 105:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 >> value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 106;
                                    case 106:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 >> value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 107;
                                    case 107:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 & value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 108;
                                    case 108:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 & value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 109;
                                    case 109:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 | value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 110;
                                    case 110:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 | value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 111;
                                    case 111:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 ^ value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 112;
                                    case 112:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            this_1.operandStack.push(value1 ^ value2);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 113;
                                    case 113:
                                        {
                                            index_14 = opcode.operands[0];
                                            vConst = opcode.operands[1];
                                            this_1.locals[index_14].setValue(this_1.locals[index_14].getValue() + vConst);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 114;
                                    case 114: return [3 /*break*/, 179];
                                    case 115:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            if (value2 < value1)
                                                this_1.operandStack.push(1);
                                            else if (value2 == value1)
                                                this_1.operandStack.push(0);
                                            else
                                                this_1.operandStack.push(-1);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 116;
                                    case 116:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            if (isNaN(value1) || isNaN(value2))
                                                this_1.operandStack.push(-1);
                                            else if (value2 < value1)
                                                this_1.operandStack.push(1);
                                            else if (value2 == value1)
                                                this_1.operandStack.push(0);
                                            else
                                                this_1.operandStack.push(-1);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 117;
                                    case 117:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            if (isNaN(value1) || isNaN(value2))
                                                this_1.operandStack.push(-1);
                                            else if (value2 < value1)
                                                this_1.operandStack.push(1);
                                            else if (value2 == value1)
                                                this_1.operandStack.push(0);
                                            else
                                                this_1.operandStack.push(1);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 118;
                                    case 118:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            if (isNaN(value1) || isNaN(value2))
                                                this_1.operandStack.push(-1);
                                            else if (value2 < value1)
                                                this_1.operandStack.push(1);
                                            else if (value2 == value1)
                                                this_1.operandStack.push(0);
                                            else
                                                this_1.operandStack.push(-1);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 119;
                                    case 119:
                                        {
                                            value2 = this_1.operandStack.pop();
                                            value1 = this_1.operandStack.pop();
                                            if (isNaN(value1) || isNaN(value2))
                                                this_1.operandStack.push(-1);
                                            else if (value2 < value1)
                                                this_1.operandStack.push(1);
                                            else if (value2 == value1)
                                                this_1.operandStack.push(0);
                                            else
                                                this_1.operandStack.push(1);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 120;
                                    case 120:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        if (!(this_1.operandStack.pop() === 0)) return [3 /*break*/, 122];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 121:
                                        _g.sent();
                                        _g.label = 122;
                                    case 122: return [3 /*break*/, 179];
                                    case 123:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        if (!(this_1.operandStack.pop() !== 0)) return [3 /*break*/, 125];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 124:
                                        _g.sent();
                                        return [2 /*return*/, "break-mainloop"];
                                    case 125: return [3 /*break*/, 179];
                                    case 126:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        if (!(this_1.operandStack.pop() < 0)) return [3 /*break*/, 128];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 127:
                                        _g.sent();
                                        _g.label = 128;
                                    case 128: return [3 /*break*/, 179];
                                    case 129:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        if (!(this_1.operandStack.pop() >= 0)) return [3 /*break*/, 131];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 130:
                                        _g.sent();
                                        _g.label = 131;
                                    case 131: return [3 /*break*/, 179];
                                    case 132:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        if (!(this_1.operandStack.pop() > 0)) return [3 /*break*/, 134];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 133:
                                        _g.sent();
                                        _g.label = 134;
                                    case 134: return [3 /*break*/, 179];
                                    case 135:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        if (!(this_1.operandStack.pop() <= 0)) return [3 /*break*/, 137];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 136:
                                        _g.sent();
                                        _g.label = 137;
                                    case 137: return [3 /*break*/, 179];
                                    case 138:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        value2 = this_1.operandStack.pop();
                                        value1 = this_1.operandStack.pop();
                                        if (!(value1 === value2)) return [3 /*break*/, 140];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 139:
                                        _g.sent();
                                        _g.label = 140;
                                    case 140: return [3 /*break*/, 179];
                                    case 141:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        value2 = this_1.operandStack.pop();
                                        value1 = this_1.operandStack.pop();
                                        if (!(value1 !== value2)) return [3 /*break*/, 143];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 142:
                                        _g.sent();
                                        _g.label = 143;
                                    case 143: return [3 /*break*/, 179];
                                    case 144:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        value2 = this_1.operandStack.pop();
                                        value1 = this_1.operandStack.pop();
                                        if (!(value1 < value2)) return [3 /*break*/, 146];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 145:
                                        _g.sent();
                                        _g.label = 146;
                                    case 146: return [3 /*break*/, 179];
                                    case 147:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        value2 = this_1.operandStack.pop();
                                        value1 = this_1.operandStack.pop();
                                        if (!(value1 >= value2)) return [3 /*break*/, 149];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 148:
                                        _g.sent();
                                        _g.label = 149;
                                    case 149: return [3 /*break*/, 179];
                                    case 150:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        value2 = this_1.operandStack.pop();
                                        value1 = this_1.operandStack.pop();
                                        if (!(value1 > value2)) return [3 /*break*/, 152];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 151:
                                        _g.sent();
                                        _g.label = 152;
                                    case 152: return [3 /*break*/, 179];
                                    case 153:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        value2 = this_1.operandStack.pop();
                                        value1 = this_1.operandStack.pop();
                                        if (!(value1 <= value2)) return [3 /*break*/, 155];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 154:
                                        _g.sent();
                                        _g.label = 155;
                                    case 155: return [3 /*break*/, 179];
                                    case 156:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 157:
                                        _g.sent();
                                        return [3 /*break*/, 179];
                                    case 158:
                                        {
                                            this_1.thread.stack[this_1.thread.runtimeDataArea.getPCRegister(this_1.thread.id) - 2].operandStack.push(this_1.operandStack.pop());
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 159;
                                    case 159:
                                        {
                                            this_1.isRunning = false;
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 160;
                                    case 160:
                                        {
                                            indexByte1 = opcode.operands[0];
                                            indexByte2 = opcode.operands[1];
                                            methodRef = getConstantPoolInfo(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                                            methodNameAndTypeRef = getConstantPoolInfo(this_1.constantPool, methodRef.nameAndTypeIndex).info;
                                            argumentsAndReturnType = getArgumentsAndReturnType(readUtf8FromConstantPool(this_1.constantPool, methodNameAndTypeRef.descriptorIndex));
                                            argumentsCount = argumentsAndReturnType[0].length;
                                            methodArgs = [];
                                            for (i_2 = 0; i_2 < argumentsCount; i_2++) {
                                                methodArgs.push(this_1.operandStack.pop());
                                            }
                                            this_1.operandStack.push((_e = this_1.operandStack.pop())["constructor"].apply(_e, methodArgs));
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 161;
                                    case 161:
                                        indexByte1 = opcode.operands[0];
                                        indexByte2 = opcode.operands[1];
                                        methodRef = getConstantPoolInfo(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                                        methodNameAndTypeRef = getConstantPoolInfo(this_1.constantPool, methodRef.nameAndTypeIndex).info;
                                        clazz = getConstantPoolInfo(this_1.constantPool, methodRef.classIndex).info;
                                        className = readUtf8FromConstantPool(this_1.constantPool, clazz.nameIndex);
                                        invokeMethodName = readUtf8FromConstantPool(this_1.constantPool, methodNameAndTypeRef.nameIndex);
                                        argumentsAndReturnType = getArgumentsAndReturnType(readUtf8FromConstantPool(this_1.constantPool, methodNameAndTypeRef.descriptorIndex));
                                        argumentsCount = argumentsAndReturnType[0].length;
                                        methodArgs = [];
                                        for (i_3 = 0; i_3 < argumentsCount; i_3++) {
                                            methodArgs.push(this_1.operandStack.pop());
                                        }
                                        module_2 = void 0;
                                        _g.label = 162;
                                    case 162:
                                        _g.trys.push([162, 164, , 165]);
                                        return [4 /*yield*/, import("../../../lib/" + className + ".js")];
                                    case 163:
                                        module_2 = _g.sent();
                                        this_1.operandStack.push((_f = module_2.default)[invokeMethodName].apply(_f, methodArgs));
                                        return [3 /*break*/, 165];
                                    case 164:
                                        e_1 = _g.sent();
                                        this_1.thread.invokeMethod(invokeMethodName, this_1.classFile, methodArgs);
                                        return [3 /*break*/, 165];
                                    case 165: return [3 /*break*/, 179];
                                    case 166:
                                        indexByte1 = opcode.operands[0];
                                        indexByte2 = opcode.operands[1];
                                        classRef = getConstantPoolInfo(this_1.constantPool, (indexByte1 << 8) | indexByte2).info;
                                        className = readUtf8FromConstantPool(this_1.constantPool, classRef.nameIndex);
                                        module_3 = void 0;
                                        return [4 /*yield*/, import("../../../lib/" + className + ".js")];
                                    case 167:
                                        module_3 = _g.sent();
                                        this_1.operandStack.push(module_3.default);
                                        return [3 /*break*/, 179];
                                    case 168:
                                        {
                                            type = opcode.operands[0];
                                            count = this_1.operandStack.pop();
                                            array = void 0;
                                            switch (type) {
                                                case 4: {
                                                    // TODO JavaではJava標準の配列オブジェクトを持つのでは？
                                                    array = new Array(count).fill(false);
                                                    break;
                                                }
                                                default: {
                                                    array = new Array(count).fill(0);
                                                }
                                            }
                                            this_1.operandStack.push(array);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 169;
                                    case 169:
                                        {
                                            branchByte1 = opcode.operands[0];
                                            branchByte2 = opcode.operands[1];
                                            count = this_1.operandStack.pop();
                                            // TODO
                                            // const module = await import("../../../lib/" + readUtf8FromConstantPool(this.constantPool, classRef.nameIndex) + ".js")
                                            this_1.operandStack.push(new Array(count).fill(null));
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 170;
                                    case 170:
                                        {
                                            this_1.operandStack.push(this_1.operandStack.pop().length);
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 171;
                                    case 171:
                                        {
                                            branchByte1 = opcode.operands[0];
                                            branchByte2 = opcode.operands[1];
                                            dimension = opcode.operands[2];
                                            createMultiDimensionalArray_1 = function (n) {
                                                if (n > 0) {
                                                    return new Array(_this.operandStack.pop()).fill(createMultiDimensionalArray_1(n - 1));
                                                }
                                                else {
                                                    return null;
                                                }
                                            };
                                            // TODO
                                            // const module = await import("../../../lib/" + readUtf8FromConstantPool(this.constantPool, classRef.nameIndex) + ".js")
                                            this_1.operandStack.push(createMultiDimensionalArray_1(dimension));
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 172;
                                    case 172:
                                        {
                                            branchByte1 = opcode.operands[0];
                                            branchByte2 = opcode.operands[1];
                                            ref = getConstantPoolInfo(this_1.constantPool, (branchByte1 << 8) | branchByte2);
                                            // TODO
                                            return [3 /*break*/, 179];
                                        }
                                        _g.label = 173;
                                    case 173:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        value = this_1.operandStack.pop();
                                        if (!(value == null)) return [3 /*break*/, 175];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 174:
                                        _g.sent();
                                        _g.label = 175;
                                    case 175: return [3 /*break*/, 179];
                                    case 176:
                                        branchByte1 = opcode.operands[0];
                                        branchByte2 = opcode.operands[1];
                                        value = this_1.operandStack.pop();
                                        if (!value) return [3 /*break*/, 178];
                                        return [4 /*yield*/, this_1.executeOpcodes(opcode.id + ((branchByte1 << 8) | branchByte2))];
                                    case 177:
                                        _g.sent();
                                        _g.label = 178;
                                    case 178: return [3 /*break*/, 179];
                                    case 179: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = index;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.opcodes.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        if (state_1 === "break")
                            return [3 /*break*/, 4];
                        switch (state_1) {
                            case "break-mainloop": return [3 /*break*/, 4];
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Frame.prototype.loadOpcodes = function () {
        var _this = this;
        var codeAttributes = this.method.attributes.filter(function (attribute) { return readUtf8FromConstantPool(_this.constantPool, attribute.attributeNameIndex) === "Code"; });
        if (!codeAttributes || codeAttributes.length == 0)
            return;
        var codeAttribute = codeAttributes[0];
        var code = codeAttribute.code;
        code.resetOffset();
        var opcode;
        var id = 0;
        while (code.offset < code.getLength()) {
            opcode = code.getUint8();
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
                // ireturn
                case 0xac: {
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
export { Frame };
//# sourceMappingURL=Frame.js.map