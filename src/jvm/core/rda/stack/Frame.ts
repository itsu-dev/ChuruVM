import {
    CONSTANT_CLASS,
    CONSTANT_DOUBLE,
    CONSTANT_FLOAT,
    CONSTANT_INTEGER,
    CONSTANT_LONG,
    CONSTANT_STRING,
    ConstantClassInfo,
    ConstantDoubleInfo, ConstantFieldRefInfo,
    ConstantFloatInfo,
    ConstantIntegerInfo, ConstantInvokeDynamicInfo,
    ConstantLongInfo, ConstantMethodHandleInfo,
    ConstantMethodRefInfo,
    ConstantNameAndTypeInfo,
    ConstantPoolInfo,
    ConstantStringInfo,
    isConstantFieldRefInfo,
    readUtf8FromConstantPool
} from "../../../models/info/ConstantPoolInfo.js";
import {PrimitiveArrayVariable} from "../../../models/Variable.js";
import {BootstrapMethod, BootstrapMethodsAttribute, CodeAttribute} from "../../../models/info/AttributeInfo.js";
import {MethodInfo} from "../../../models/info/MethodInfo.js";
import {NoSuchFieldError} from "../../../lib/java/lang/NoSuchFieldError.js";
import {ByteBuffer} from "../../../utils/ByteBuffer.js";
import {System} from "../../../lib/java/lang/System.js";
import {JVM, throwErrorOrException} from "../../../jvm.js";
import Thread from "./Thread.js";
import {getConstantPoolInfo, getArgumentsAndReturnType} from "../../cfl/ClassFileLoader.js";
import JavaClass from "../../cfl/JavaClass";
import BootstrapClassLoader from "../../BootstrapClassLoader";
import {JavaObject, JavaVariable} from "../../cfl/types";
import RuntimeDataArea from "../RuntimeDataArea";
import {logMethod} from "../../../utils/Log";
import {cyrb53, getString} from "../../../utils/Utils";
import {JavaObject as JObject} from "../../../lib/java/lang/JavaObject"
import {throwException} from "../../../utils/ExceptionHandler";

export type Opcode = {
    id: number,
    opcode: number,
    operands: Array<number>
}

export class Frame {

    readonly thread: Thread
    readonly method: MethodInfo;
    readonly javaClass: JavaClass;
    readonly locals: Array<JavaVariable>;
    readonly constantPool: ConstantPoolInfo[];
    readonly opcodes = new Array<Opcode>();
    readonly javaObject: JavaObject | null;
    readonly runtimeDataArea: RuntimeDataArea;
    isRunning = true;
    operandStack: Array<any> = [];
    opcode: Opcode

    constructor(thread: Thread, runtimeDataArea: RuntimeDataArea, method: MethodInfo, javaClass: JavaClass, localSize: number, constantPool: ConstantPoolInfo[], args: Array<any>, javaObject: JavaObject) {
        this.thread = thread;
        this.runtimeDataArea = runtimeDataArea;
        this.method = method;
        this.javaClass = javaClass;
        this.locals = new Array(localSize);
        this.constantPool = constantPool;
        this.javaObject = javaObject;

        // create this object on object heap
        let offset = 0;
        if (!(this.javaObject == null)) {
            this.locals[0] = new JavaVariable(
                this.javaClass.name,
                this.javaObject
            );
            offset++;
        }

        const argsData = getArgumentsAndReturnType(readUtf8FromConstantPool(javaClass.constantPool, this.method.descriptorIndex))[0];
        args.reverse().forEach((arg, index) => {
                this.locals[index + offset] = new JavaVariable(
                    argsData[index].split("/").join("."), arg);
            }
        );
    }

    execute(): any {
        return this.executeOpcodes(0);
    }

    private executeOpcodes(id: number): any {
        // TODO
        const name = readUtf8FromConstantPool(this.constantPool, this.method.nameIndex);

        if (name === "newInstance") {
            const klazz = getString(this.runtimeDataArea, (this.runtimeDataArea.objectHeap[(this.locals[0].value as JavaObject).heapIndex] as JavaVariable[]).filter(v => v.name === "name")[0].value as JavaObject);
            const obj = this.javaClass.getSimpleName() == "Array" ? this.runtimeDataArea.createAArray(klazz, this.locals[0].value as number) : this.runtimeDataArea.createObject(klazz);
            obj.init(this.runtimeDataArea)
            this.thread.invokeMethod("<init>", "()V", obj.type, [], obj);

            return obj;
        }

        // TODO
        if (name == "clone") {
            return Object.assign(Object.create(Object.getPrototypeOf(this.javaObject)), this.javaObject);
        }

        // TODO
        if (name == "checkForTypeAlias" || name == "checkSlotCount") return;

        if (name == "parameterSlotCount") return 0;

        if (name == "referenceKindIsConsistent" || name == "vminfoIsConsistent" || name == "verifyConstants") return true;

        if (this.javaClass.name == "java.lang.ref.Reference" && name == "<clinit>") return;

        if (this.opcodes[this.opcodes.length - 1].id < id) {
            id = id - 65536;
        }

        const index = this.getOpcodeIndexById(id);

        for (let i = index; i < this.opcodes.length; i++) {
            this.opcode = this.opcodes[i];

            if (!this.isRunning || !this.opcode) break;

            if (((23 <= this.opcode.id && this.opcode.id <= 38) || (115 <= this.opcode.id && this.opcode.id <= 123) || (138 <= this.opcode.id && this.opcode.id <= 138)) && name === "initializeSystemClass") continue;

            switch (this.opcode.opcode) {
                // nop
                case 0x00: {
                    break;
                }

                // aconst_null
                case 0x01: {
                    this.operandStack.push(null);
                    break;
                }

                // getstatic
                case 0xb2: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const constantPoolInfo = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2);
                    const fieldRef = constantPoolInfo.info as ConstantFieldRefInfo;
                    const classRef = getConstantPoolInfo(this.constantPool, fieldRef.classIndex).info as ConstantClassInfo;
                    const fieldNameAndTypeRef = getConstantPoolInfo(this.constantPool, fieldRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo;

                    const klass = BootstrapClassLoader.getInstance().findClass(readUtf8FromConstantPool(this.constantPool, classRef.nameIndex).split("/").join("."));
                    klass.initStatic(this.thread);

                    const field = klass.getDeclaredField(readUtf8FromConstantPool(this.constantPool, fieldNameAndTypeRef.nameIndex));
                    this.operandStack.push(field.staticValue);

                    break;
                }

                // putstatic
                case 0xb3: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const constantPoolInfo = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2);
                    const fieldRef = constantPoolInfo.info as ConstantFieldRefInfo;
                    const classRef = getConstantPoolInfo(this.constantPool, fieldRef.classIndex).info as ConstantClassInfo
                    const fieldNameAndTypeRef = getConstantPoolInfo(this.constantPool, fieldRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo
                    // const fieldClassFileName = readUtf8FromConstantPool(this.constantPool, fieldNameAndTypeRef.nameIndex).split("/").join(".");

                    const klass = BootstrapClassLoader.getInstance().findClass(readUtf8FromConstantPool(this.constantPool, classRef.nameIndex).split("/").join("."));
                    klass.initStatic(this.thread);

                    const field = klass.getDeclaredField(readUtf8FromConstantPool(this.constantPool, fieldNameAndTypeRef.nameIndex));
                    field.staticValue = this.operandStack.pop();

                    break;
                }

                // getfield
                case 0xb4: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const constantPoolInfo = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2);
                    const fieldRef = constantPoolInfo.info as ConstantFieldRefInfo;
                    const classRef = getConstantPoolInfo(this.constantPool, fieldRef.classIndex).info as ConstantClassInfo
                    const fieldNameAndTypeRef = getConstantPoolInfo(this.constantPool, fieldRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo
                    const fieldName = readUtf8FromConstantPool(this.constantPool, fieldNameAndTypeRef.nameIndex);

                    const obj = this.operandStack.pop() as JavaObject;

                    this.operandStack.push(
                        (this.runtimeDataArea.objectHeap[obj.heapIndex] as JavaVariable[])
                            .filter(variable => variable.name === fieldName)[0]
                            .value
                    );

                    break;
                }

                // putfield
                case 0xb5: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const constantPoolInfo = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2);
                    const fieldRef = constantPoolInfo.info as ConstantFieldRefInfo;
                    const classRef = getConstantPoolInfo(this.constantPool, fieldRef.classIndex).info as ConstantClassInfo
                    const fieldNameAndTypeRef = getConstantPoolInfo(this.constantPool, fieldRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo
                    const fieldName = readUtf8FromConstantPool(this.constantPool, fieldNameAndTypeRef.nameIndex);

                    const value = this.operandStack.pop();
                    const obj = this.operandStack.pop() as JavaObject;
                    (this.runtimeDataArea.objectHeap[obj.heapIndex] as JavaVariable[])
                        .filter(variable => variable.name === fieldName)[0]
                        .value = value;

                    break;
                }

                // ldc
                case 0x12: {
                    const index = this.opcode.operands[0];
                    const info = getConstantPoolInfo(this.constantPool, index).info;

                    if (info.tag === CONSTANT_STRING) {
                        const object = this.runtimeDataArea.createStringObject(this.thread, readUtf8FromConstantPool(this.constantPool, (info as ConstantStringInfo).stringIndex));
                        this.operandStack.push(object);

                    } else if (info.tag === CONSTANT_INTEGER) {
                        const dataView = new ByteBuffer(new ArrayBuffer(32));
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[0]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[1]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[2]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[3]);
                        dataView.resetOffset();
                        this.operandStack.push((info as ConstantIntegerInfo).bytes[0] << 24 | (info as ConstantIntegerInfo).bytes[1] << 16 | (info as ConstantIntegerInfo).bytes[2] << 8 | (info as ConstantIntegerInfo).bytes[3]);

                    } else if (info.tag === CONSTANT_FLOAT) {
                        const dataView = new ByteBuffer(new ArrayBuffer(32));
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[0]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[1]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[2]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[3]);
                        dataView.resetOffset();
                        this.operandStack.push(dataView.getFloat32());

                    } else if (info.tag === CONSTANT_CLASS) {
                        const classRef = info as ConstantClassInfo;
                        const obj = this.runtimeDataArea.createClassObject(this.thread, BootstrapClassLoader.getInstance().findClass(readUtf8FromConstantPool(this.constantPool, classRef.nameIndex).split("/").join(".")));
                        this.operandStack.push(obj);

                    }
                    break;
                }

                // ldc_w
                case 0x13: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const info = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2).info;

                    if (info.tag === CONSTANT_STRING) {
                        const object = this.runtimeDataArea.createStringObject(this.thread, readUtf8FromConstantPool(this.constantPool, (info as ConstantStringInfo).stringIndex));
                        this.operandStack.push(object);

                    } else if (info.tag === CONSTANT_INTEGER) {
                        const dataView = new ByteBuffer(new ArrayBuffer(32));
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[0]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[1]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[2]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[3]);
                        dataView.resetOffset();
                        this.operandStack.push(dataView.getInt32());

                    } else if (info.tag === CONSTANT_FLOAT) {
                        const dataView = new ByteBuffer(new ArrayBuffer(32));
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[0]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[1]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[2]);
                        dataView.setUint8((info as ConstantIntegerInfo).bytes[3]);
                        dataView.resetOffset();
                        this.operandStack.push(dataView.getFloat32());

                    } else if (info.tag === CONSTANT_CLASS) {
                        const classRef = info as ConstantClassInfo;
                        const obj = this.runtimeDataArea.createClassObject(this.thread, BootstrapClassLoader.getInstance().findClass(readUtf8FromConstantPool(this.constantPool, classRef.nameIndex).split("/").join(".")));
                        this.operandStack.push(obj);

                    }
                    break;
                }

                // ldc2_w
                case 0x14: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const info = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2).info;

                    if (info.tag === CONSTANT_LONG) {
                        const dataView = new ByteBuffer(new ArrayBuffer(64));
                        dataView.setUint32((info as ConstantLongInfo).highBytes);
                        dataView.setUint32((info as ConstantLongInfo).lowBytes);
                        dataView.resetOffset();
                        this.operandStack.push(dataView.getBigInt64());

                    } else if (info.tag === CONSTANT_DOUBLE) {
                        const dataView = new ByteBuffer(new ArrayBuffer(64));
                        dataView.setUint32((info as ConstantDoubleInfo).highBytes);
                        dataView.setUint32((info as ConstantDoubleInfo).lowBytes);
                        dataView.resetOffset();
                        this.operandStack.push(dataView.getFloat64());

                    }
                    break;
                }

                // invokevirtual
                case 0xb6: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const methodRef = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2).info as ConstantMethodRefInfo;
                    const methodNameAndTypeRef = getConstantPoolInfo(this.constantPool, methodRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo;
                    const clazz = getConstantPoolInfo(this.constantPool, methodRef.classIndex).info as ConstantClassInfo;
                    const className = readUtf8FromConstantPool(this.constantPool, clazz.nameIndex);
                    const descriptor = readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.descriptorIndex);
                    const invokeMethodName = readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.nameIndex);
                    const argumentsAndReturnType = getArgumentsAndReturnType(readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.descriptorIndex));
                    const methodArgs = [];

                    for (let i = 0; i < argumentsAndReturnType[0].length; i++) {
                        methodArgs.push(this.operandStack.pop());
                    }

                    const javaObject = this.operandStack.pop() as JavaObject;

                    if (javaObject == null) {
                        throwException("java.lang.NullPointerException", this.runtimeDataArea)
                        this.isRunning = false;
                        return;
                    }

                    const result = this.thread.invokeMethod(invokeMethodName, descriptor, javaObject.type, methodArgs, javaObject);
                    if (result !== undefined) {
                        this.operandStack.push(result);
                    }

                    break;
                }

                // iconst_m1
                case 0x02: {
                    this.operandStack.push(-1);
                    break
                }

                // iconst_0
                case 0x03: {
                    this.operandStack.push(0);
                    break
                }

                // iconst_1
                case 0x04: {
                    this.operandStack.push(1);
                    break
                }

                // iconst_2
                case 0x05: {
                    this.operandStack.push(2);
                    break
                }

                // iconst_3
                case 0x06: {
                    this.operandStack.push(3);
                    break
                }

                // iconst_4
                case 0x07: {
                    this.operandStack.push(4);
                    break
                }

                // iconst_5
                case 0x08: {
                    this.operandStack.push(5);
                    break
                }

                // lconst_0
                case 0x09: {
                    this.operandStack.push(1);
                    break;
                }

                // lconst_1
                case 0x0a: {
                    this.operandStack.push(2);
                    break;
                }

                // fconst_0
                case 0x0b: {
                    this.operandStack.push(0.0);
                    break;
                }

                // fconst_1
                case 0x0c: {
                    this.operandStack.push(1.0);
                    break;
                }

                // fconst_2
                case 0x0d: {
                    this.operandStack.push(2.0);
                    break;
                }

                // dconst_0
                case 0x0e: {
                    this.operandStack.push(0.0);
                    break;
                }

                // dconst_1
                case 0x0f: {
                    this.operandStack.push(1.0);
                    break;
                }

                // bipush
                case 0x10: {
                    const data = this.opcode.operands[0];
                    this.operandStack.push(data);
                    break;
                }

                // sipush
                case 0x11: {
                    const byte1 = this.opcode.operands[0];
                    const byte2 = this.opcode.operands[1];
                    this.operandStack.push((byte1 << 8) | byte2);
                    break;
                }

                // iload
                case 0x15: {
                    const index = this.opcode.operands[0];
                    this.operandStack.push(this.locals[index].value);
                    break;
                }

                // lload
                case 0x16: {
                    const index = this.opcode.operands[0];
                    this.operandStack.push(this.locals[index].value);
                    break;
                }

                // fload
                case 0x17: {
                    const index = this.opcode.operands[0];
                    this.operandStack.push(this.locals[index].value);
                    break;
                }

                // dload
                case 0x18: {
                    const index = this.opcode.operands[0];
                    this.operandStack.push(this.locals[index].value);
                    break;
                }

                // aload
                case 0x19: {
                    const index = this.opcode.operands[0];
                    this.operandStack.push(this.locals[index].value);
                    break;
                }

                // iload_0
                case 0x1a: {
                    this.operandStack.push(this.locals[0].value);
                    break;
                }

                // iload_1
                case 0x1b: {
                    this.operandStack.push(this.locals[1].value);
                    break;
                }

                // iload_2
                case 0x1c: {
                    this.operandStack.push(this.locals[2].value);
                    break;
                }

                // iload_3
                case 0x1d: {
                    this.operandStack.push(this.locals[3].value);
                    break;
                }

                // lload_0
                case 0x1e: {
                    this.operandStack.push(this.locals[0].value);
                    break;
                }

                // lload_1
                case 0x1f: {
                    this.operandStack.push(this.locals[1].value);
                    break;
                }

                // lload_2
                case 0x20: {
                    this.operandStack.push(this.locals[2].value);
                    break;
                }

                // lload_3
                case 0x21: {
                    this.operandStack.push(this.locals[3].value);
                    break;
                }

                // fload_0
                case 0x22: {
                    this.operandStack.push(this.locals[0].value);
                    break;
                }

                // fload_1
                case 0x23: {
                    this.operandStack.push(this.locals[1].value);
                    break;
                }

                // fload_2
                case 0x24: {
                    this.operandStack.push(this.locals[2].value);
                    break;
                }

                // fload_3
                case 0x25: {
                    this.operandStack.push(this.locals[3].value);
                    break;
                }

                // dload_0
                case 0x26: {
                    this.operandStack.push(this.locals[0].value);
                    break;
                }

                // dload_1
                case 0x27: {
                    this.operandStack.push(this.locals[1].value);
                    break;
                }

                // dload_2
                case 0x28: {
                    this.operandStack.push(this.locals[2].value);
                    break;
                }

                // dload_3
                case 0x29: {
                    this.operandStack.push(this.locals[3].value);
                    break;
                }

                // aload_0
                case 0x2a: {
                    this.operandStack.push(this.locals[0].value);
                    break;
                }

                // aload_1
                case 0x2b: {
                    this.operandStack.push(this.locals[1].value);
                    break;
                }

                // aload_2
                case 0x2c: {
                    this.operandStack.push(this.locals[2].value);
                    break;
                }

                // aload_3
                case 0x2d: {
                    this.operandStack.push(this.locals[3].value);
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
                    const index = this.operandStack.pop();
                    const array = this.operandStack.pop() as JavaObject;
                    this.operandStack.push((this.runtimeDataArea.objectHeap[array.heapIndex] as Array<any>)[index]);
                    break;
                }

                // istore
                case 0x36: {
                    const index = this.opcode.operands[0];
                    this.locals[index] = new JavaVariable(
                        "java.lang.Integer",
                        this.operandStack.pop());
                    break;
                }

                // lstore
                case 0x37: {
                    const index = this.opcode.operands[0];
                    this.locals[index] = new JavaVariable(
                        "java.lang.Long",
                        this.operandStack.pop());
                    break;
                }

                // fstore
                case 0x38: {
                    const index = this.opcode.operands[0];
                    this.locals[index] = new JavaVariable(
                        "java.lang.Float",
                        this.operandStack.pop());
                    break;
                }

                // dstore
                case 0x39: {
                    const index = this.opcode.operands[0];
                    this.locals[index] = new JavaVariable(
                        "java.lang.Double",
                        this.operandStack.pop());
                    break;
                }

                // astore
                case 0x3a: {
                    const index = this.opcode.operands[0];
                    const obj = this.operandStack.pop() as JavaObject;
                    this.locals[index] = new JavaVariable(obj == null ? null : obj.type.name, obj);
                    break;
                }

                // istore_0
                case 0x3b: {
                    this.locals[0] = new JavaVariable(
                        "java.lang.Integer",
                        this.operandStack.pop());
                    break;
                }

                // istore_1
                case 0x3c: {
                    this.locals[1] = new JavaVariable(
                        "java.lang.Integer",
                        this.operandStack.pop());
                    break;
                }

                // istore_2
                case 0x3d: {
                    this.locals[2] = new JavaVariable(
                        "java.lang.Integer",
                        this.operandStack.pop());
                    break;
                }

                // istore_3
                case 0x3e: {
                    this.locals[3] = new JavaVariable(
                        "java.lang.Integer",
                        this.operandStack.pop());
                    break;
                }

                // lstore_0
                case 0x3f: {
                    this.locals[0] = new JavaVariable(
                        "java.lang.Long",
                        this.operandStack.pop());
                    break;
                }

                // lstore_1
                case 0x40: {
                    this.locals[1] = new JavaVariable(
                        "java.lang.Long",
                        this.operandStack.pop());
                    break;
                }

                // lstore_2
                case 0x41: {
                    this.locals[2] = new JavaVariable(
                        "java.lang.Long",
                        this.operandStack.pop());
                    break;
                }

                // lstore_3
                case 0x42: {
                    this.locals[3] = new JavaVariable(
                        "java.lang.Long",
                        this.operandStack.pop());
                    break;
                }

                // fstore_0
                case 0x43: {
                    this.locals[0] = new JavaVariable(
                        "java.lang.Float",
                        this.operandStack.pop());
                    break;
                }

                // fstore_1
                case 0x44: {
                    this.locals[1] = new JavaVariable(
                        "java.lang.Float",
                        this.operandStack.pop());
                    break;
                }

                // fstore_2
                case 0x45: {
                    this.locals[2] = new JavaVariable(
                        "java.lang.Float",
                        this.operandStack.pop());
                    break;
                }

                // fstore_3
                case 0x46: {
                    this.locals[3] = new JavaVariable(
                        "java.lang.Float",
                        this.operandStack.pop());
                    break;
                }

                // dstore_0
                case 0x47: {
                    this.locals[0] = new JavaVariable(
                        "java.lang.Double",
                        this.operandStack.pop());
                    break;
                }

                // dstore_1
                case 0x48: {
                    this.locals[1] = new JavaVariable(
                        "java.lang.Double",
                        this.operandStack.pop());
                    break;
                }

                // dstore_2
                case 0x48: {
                    this.locals[2] = new JavaVariable(
                        "java.lang.Double",
                        this.operandStack.pop());
                    break;
                }

                // dstore_3
                case 0x4a: {
                    this.locals[3] = new JavaVariable(
                        "java.lang.Double",
                        this.operandStack.pop());
                    break;
                }

                // astore_0
                case 0x4b: {
                    const obj = this.operandStack.pop() as JavaObject;
                    this.locals[0] = new JavaVariable(obj == null ? null : obj.type.name, obj);
                    break;
                }

                // astore_1
                case 0x4c: {
                    const obj = this.operandStack.pop() as JavaObject;
                    this.locals[1] = new JavaVariable(obj == null ? null : obj.type.name, obj);
                    break;
                }

                // astore_2
                case 0x4d: {
                    const obj = this.operandStack.pop() as JavaObject;
                    this.locals[2] = new JavaVariable(obj == null ? null : obj.type.name, obj);
                    break;
                }

                // astore_3
                case 0x4e: {
                    const obj = this.operandStack.pop() as JavaObject;
                    this.locals[3] = new JavaVariable(obj == null ? null : obj.type.name, obj);
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
                    const value = this.operandStack.pop();
                    const index = this.operandStack.pop();
                    const array = this.operandStack.pop() as JavaObject;
                    (this.runtimeDataArea.objectHeap[array.heapIndex] as Array<any>)[index] = value;
                    // array[index] = value;
                    break;
                }

                // pop
                case 0x57: {
                    this.operandStack.pop();
                    break;
                }

                // pop2
                case 0x58: {
                    // TODO
                    const isCategory1 = (data) => data instanceof JavaVariable || data instanceof JavaVariable
                    const isCategory2 = (data) => data instanceof JavaVariable || data instanceof JavaVariable
                    const value1 = this.operandStack.pop();
                    if (isCategory2(value1)) break;
                    else if (isCategory1(value1)) {
                        const value2 = this.operandStack.pop();
                        if (isCategory1(value2)) break;
                        else {
                            console.error("Illegal operation: pop2 with category 1.")
                            return;
                        }
                    }
                    break;
                }

                // dup
                case 0x59: {
                    const original = this.operandStack.pop();

                    if (original == null) {
                        this.operandStack.push(null);
                        this.operandStack.push(null);
                        break;
                    }

                    if (typeof original == "number") {
                        this.operandStack.push(original);
                        this.operandStack.push(original);
                        break;
                    }

                    const copied = Object.assign(Object.create(Object.getPrototypeOf(original)), original);
                    const copied2 = Object.assign(Object.create(Object.getPrototypeOf(original)), original);
                    this.operandStack.push(copied);
                    this.operandStack.push(copied2);
                    break;
                }

                // dup_x1
                case 0x5a: {
                    const value1 = this.operandStack.pop();
                    const value2 = this.operandStack.pop();

                    if (value1 == null) {
                        this.operandStack.push(null);
                        this.operandStack.push(value2);
                        this.operandStack.push(null);
                        break;
                    }

                    if (typeof value1 == "number") {
                        this.operandStack.push(value1);
                        this.operandStack.push(value2)
                        this.operandStack.push(value1);
                        break;
                    }

                    const copied = Object.assign(Object.create(Object.getPrototypeOf(value1)), value1);
                    const copied2 = Object.assign(Object.create(Object.getPrototypeOf(value1)), value1);
                    this.operandStack.push(copied);
                    this.operandStack.push(value2);
                    this.operandStack.push(copied2);

                    break;
                }

                // iadd
                case 0x60: {
                    this.operandStack.push(this.operandStack.pop() + this.operandStack.pop());
                    break;
                }

                // ladd
                case 0x61: {
                    this.operandStack.push(this.operandStack.pop() + this.operandStack.pop());
                    break;
                }

                // fadd
                case 0x62: {
                    this.operandStack.push(this.operandStack.pop() + this.operandStack.pop());
                    break;
                }

                // dadd
                case 0x63: {
                    this.operandStack.push(this.operandStack.pop() + this.operandStack.pop());
                    break;
                }

                // isub
                case 0x64: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 - value2);
                    break;
                }

                // lsub
                case 0x65: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() - value2);
                    break;
                }

                // fsub
                case 0x66: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() - value2);
                    break;
                }

                // dsub
                case 0x67: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() - value2);
                    break;
                }

                // imul
                case 0x68: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() * value2);
                    break;
                }

                // lmul
                case 0x69: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() * value2);
                    break;
                }

                // fmul
                case 0x6a: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() * value2);
                    break;
                }

                // dmul
                case 0x6b: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() * value2);
                    break;
                }

                // idiv
                case 0x6c: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() / value2);
                    break;
                }

                // ldiv
                case 0x6d: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() / value2);
                    break;
                }

                // fdiv
                case 0x6e: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() / value2);
                    break;
                }

                // ddiv
                case 0x6f: {
                    const value2 = this.operandStack.pop();
                    this.operandStack.push(this.operandStack.pop() / value2);
                    break;
                }

                // irem
                case 0x70: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 % value2);
                    break;
                }

                // lrem
                case 0x71: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 % value2);
                    break;
                }

                // frem
                case 0x72: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 % value2);
                    break;
                }

                // drem
                case 0x73: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 % value2);
                    break;
                }

                // ineg
                case 0x74: {
                    this.operandStack.push(-this.operandStack.pop());
                    break;
                }

                // lneg
                case 0x75: {
                    this.operandStack.push(-this.operandStack.pop());
                    break;
                }

                // fneg
                case 0x76: {
                    this.operandStack.push(-this.operandStack.pop());
                    break;
                }

                // dneg
                case 0x77: {
                    this.operandStack.push(-this.operandStack.pop());
                    break;
                }

                // ishl
                case 0x78: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 << value2);
                    break;
                }

                // lshl
                case 0x79: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 << value2);
                    break;
                }

                // ishr
                case 0x7a: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 >> value2);
                    break;
                }

                // lshr
                case 0x7b: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 >> value2);
                    break;
                }

                // iushr
                case 0x7c: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 >> value2);
                    break;
                }

                // lushr
                case 0x7d: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 >> value2);
                    break;
                }

                // iand
                case 0x7e: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 & value2);
                    break;
                }

                // land
                case 0x7f: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 & value2);
                    break;
                }

                // ior
                case 0x80: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 | value2);
                    break;
                }

                // lor
                case 0x81: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 | value2);
                    break;
                }

                // ixor
                case 0x82: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 ^ value2);
                    break;
                }

                // lxor
                case 0x83: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    this.operandStack.push(value1 ^ value2);
                    break;
                }

                // iinc
                case 0x84: {
                    const index = this.opcode.operands[0];
                    const vConst = this.opcode.operands[1];
                    this.locals[index].value = (this.locals[index].value as number) + vConst;
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
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (value2 < value1) this.operandStack.push(1);
                    else if (value2 == value1) this.operandStack.push(0);
                    else this.operandStack.push(-1);
                    break;
                }

                // fcmpl
                case 0x95: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (isNaN(value1) || isNaN(value2)) this.operandStack.push(-1);
                    else if (value2 < value1) this.operandStack.push(1);
                    else if (value2 == value1) this.operandStack.push(0);
                    else this.operandStack.push(-1);
                    break;
                }

                // fcmpg
                case 0x96: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (isNaN(value1) || isNaN(value2)) this.operandStack.push(-1);
                    else if (value2 < value1) this.operandStack.push(1);
                    else if (value2 == value1) this.operandStack.push(0);
                    else this.operandStack.push(1);
                    break;
                }

                // dcmpl
                case 0x97: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (isNaN(value1) || isNaN(value2)) this.operandStack.push(-1);
                    else if (value2 < value1) this.operandStack.push(1);
                    else if (value2 == value1) this.operandStack.push(0);
                    else this.operandStack.push(-1);
                    break;
                }

                // dcmpg
                case 0x98: {
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (isNaN(value1) || isNaN(value2)) this.operandStack.push(-1);
                    else if (value2 < value1) this.operandStack.push(1);
                    else if (value2 == value1) this.operandStack.push(0);
                    else this.operandStack.push(1);
                    break;
                }

                // ifeq
                case 0x99: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const a = this.operandStack.pop();
                    if (a === 0 || !a) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // ifne
                case 0x9a: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    if (this.operandStack.pop() !== 0) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // iflt
                case 0x9b: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    if (this.operandStack.pop() < 0) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // ifge
                case 0x9c: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    if (this.operandStack.pop() >= 0) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // ifgt
                case 0x9d: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    if (this.operandStack.pop() > 0) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // ifle
                case 0x9e: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    if (this.operandStack.pop() <= 0) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // if_icmpeq
                case 0x9f: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (value1 === value2) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // if_icmpne
                case 0xa0: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (value1 !== value2) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // if_icmplt
                case 0xa1: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (value1 < value2) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // if_icmpge
                case 0xa2: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (value1 >= value2) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // if_icmpgt
                case 0xa3: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (value1 > value2) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // if_icmple
                case 0xa4: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const value2 = this.operandStack.pop();
                    const value1 = this.operandStack.pop();
                    if (value1 <= value2) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // if_acmpeq
                case 0xa5: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const value2 = this.operandStack.pop() as JavaObject;
                    const value1 = this.operandStack.pop() as JavaObject;

                    if ((value1 == null && value2 == null)) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }

                    if ((value1 != null && value2 == null) || (value1 == null && value2 != null)) {
                        break;
                    }

                    // TODO
                    if (value1.type.name === "java.lang.String" && value2.type.name === "java.lang.String") {
                        const hash1 = (this.runtimeDataArea.objectHeap[value1.heapIndex] as JavaVariable[]).filter(v => v.name === "hash")[0].value;
                        const hash2 = (this.runtimeDataArea.objectHeap[value2.heapIndex] as JavaVariable[]).filter(v => v.name === "hash")[0].value;
                        if (hash1 === hash2) {
                            return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                        }
                    }

                    if (value1.type.name === value2.type.name) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // if_acmpne
                case 0xa6: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const value2 = this.operandStack.pop() as JavaObject;
                    const value1 = this.operandStack.pop() as JavaObject;

                    if ((value1 == null && value2 == null)) break;

                    if ((value1 != null && value2 == null) || (value1 == null && value2 != null)) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }

                    // TODO
                    if (value1.type.name === "java.lang.String" && value2.type.name === "java.lang.String") {
                        const hash1 = (this.runtimeDataArea.objectHeap[value1.heapIndex] as JavaVariable[]).filter(v => v.name === "hash")[0].value;
                        const hash2 = (this.runtimeDataArea.objectHeap[value2.heapIndex] as JavaVariable[]).filter(v => v.name === "hash")[0].value;
                        if (hash1 !== hash2) {
                            return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
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
                        const hashCode1 = JObject.hashCode(this.thread, this.javaClass, value1);
                        const hashCode2 = JObject.hashCode(this.thread, this.javaClass, value2);
                        if (hashCode1 !== hashCode2) {
                            return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                        }
                    } else {
                        if (value1.type.name !== value2.type.name) {
                            return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                        }
                    }

                    break;
                }

                // goto
                case 0xa7: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                }

                // tableswitch
                case 0xaa: {
                    const def = this.opcode.operands[0];
                    const low = this.opcode.operands[1];
                    const high = this.opcode.operands[2];
                    const index = this.operandStack.pop() as number;
                    const newOperands = this.operandStack.reverse();

                    console.log(index, def, this.opcode.id + def, newOperands)
                    if (index < low || high < index) {
                        return this.executeOpcodes(this.opcode.id + def);
                    } else {
                        // TODO
                        console.log(index - low, newOperands)
                        // return this.executeOpcodes(this.opcode.id);
                        return;
                    }

                    return this.executeOpcodes(this.opcode.id + def);
                }

                // lookupswitch
                case 0xab: {
                    const key = this.operandStack.pop();
                    const def = this.opcode.operands[0];
                    const npairs = this.opcode.operands[1];

                    for (let j = 2; j < npairs + 2; j++) {
                        if (this.opcode.operands[j] == key) {
                            return this.executeOpcodes(this.opcode.id + this.opcode.operands[j + 1]);
                        }
                    }

                    return this.executeOpcodes(this.opcode.id + def);
                }

                // ireturn
                case 0xac: {
                    this.isRunning = false;
                    return this.operandStack.pop();
                }

                // lreturn
                case 0xad: {
                    this.isRunning = false;
                    return this.operandStack.pop();
                }

                // freturn
                case 0xae: {
                    this.isRunning = false;
                    return this.operandStack.pop();
                }

                // dreturn
                case 0xaf: {
                    this.isRunning = false;
                    return this.operandStack.pop();
                }

                // areturn
                case 0xb0: {
                    this.isRunning = false;
                    return this.operandStack.pop();
                }

                // return
                case 0xb1: {
                    this.isRunning = false;
                    return;
                }

                // invokespecial
                case 0xb7: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const methodRef = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2).info as ConstantMethodRefInfo;
                    const methodNameAndTypeRef = getConstantPoolInfo(this.constantPool, methodRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo;
                    const argumentsAndReturnType = getArgumentsAndReturnType(readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.descriptorIndex));
                    const descriptor = readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.descriptorIndex);
                    const argumentsCount = argumentsAndReturnType[0].length;
                    const clazz = getConstantPoolInfo(this.constantPool, methodRef.classIndex).info as ConstantClassInfo;
                    const invokeMethodName = readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.nameIndex).split("/").join(".");
                    const className = readUtf8FromConstantPool(this.constantPool, clazz.nameIndex).split("/").join(".");
                    const methodArgs = [];

                    for (let i = 0; i < argumentsCount; i++) {
                        methodArgs.push(this.operandStack.pop());
                    }

                    // TODO
                    if (className === "java.lang.ThreadLocal") {
                        this.operandStack.push(null);
                        break;
                    }

                    const obj = this.operandStack.pop();
                    const result = this.thread.invokeMethod(invokeMethodName, descriptor, BootstrapClassLoader.getInstance().findClass(className), methodArgs, obj);
                    if (result !== undefined) {
                        this.operandStack.push(result);
                    }

                    break;
                }

                // invokestatic
                case 0xb8: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const methodRef = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2).info as ConstantMethodRefInfo;
                    const methodNameAndTypeRef = getConstantPoolInfo(this.constantPool, methodRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo;
                    const descriptor = readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.descriptorIndex);
                    const clazz = getConstantPoolInfo(this.constantPool, methodRef.classIndex).info as ConstantClassInfo;
                    const className = readUtf8FromConstantPool(this.constantPool, clazz.nameIndex).split("/").join(".");
                    const invokeMethodName = readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.nameIndex);
                    const argumentsAndReturnType = getArgumentsAndReturnType(readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.descriptorIndex));
                    const argumentsCount = argumentsAndReturnType[0].length;
                    const methodArgs = [];

                    // TODO
                    if (invokeMethodName == "newUpdater") {
                        this.operandStack.push(null);
                        break;
                    }

                    for (let i = 0; i < argumentsCount; i++) {
                        methodArgs.push(this.operandStack.pop());
                    }

                    // TODO
                    if (className == "java.lang.reflect.Modifier") {
                        const klass = BootstrapClassLoader.getInstance().findClass(className.split("/").join("."));
                        klass.initStatic(this.thread);
                    }

                    const result = this.thread.invokeMethod(invokeMethodName, descriptor, BootstrapClassLoader.getInstance().findClass(className), methodArgs, null);
                    if (result !== undefined) {
                        this.operandStack.push(result);
                    }

                    break;
                }

                // invokeinterface
                case 0xb9: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const methodRef = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2).info as ConstantMethodRefInfo;
                    const methodNameAndTypeRef = getConstantPoolInfo(this.constantPool, methodRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo;
                    const descriptor = readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.descriptorIndex);
                    const invokeMethodName = readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.nameIndex);
                    const argumentsAndReturnType = getArgumentsAndReturnType(readUtf8FromConstantPool(this.constantPool, methodNameAndTypeRef.descriptorIndex));
                    const argumentsCount = argumentsAndReturnType[0].length;
                    const methodArgs = [];

                    for (let i = 0; i < argumentsCount; i++) {
                        methodArgs.push(this.operandStack.pop());
                    }

                    const obj = this.operandStack.pop();
                    const result = this.thread.invokeMethod(invokeMethodName, descriptor, obj.type, methodArgs, obj);
                    if (result !== undefined) {
                        this.operandStack.push(result);
                    }

                    break;
                }

                // invokedynamic
                case 0xba: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const invokeDynamicRef = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2).info as ConstantInvokeDynamicInfo;
                    const bootstrapMethodAttr = this.javaClass.attributes.filter(attribute => readUtf8FromConstantPool(this.constantPool, attribute.attributeNameIndex) == "BootstrapMethods")[0] as BootstrapMethodsAttribute;
                    const bootstrapMethodRef = getConstantPoolInfo(this.constantPool, bootstrapMethodAttr.bootstrapMethods[invokeDynamicRef.bootstrapMethodAttrIndex].bootstrapMethodRef).info as ConstantMethodHandleInfo;
                    const bootstrapMethod = getConstantPoolInfo(this.constantPool, bootstrapMethodRef.referenceIndex).info as ConstantMethodRefInfo;
                    const bootstrapMethodClass = getConstantPoolInfo(this.constantPool, bootstrapMethod.classIndex).info as ConstantClassInfo;
                    const nameAndTypeRef = getConstantPoolInfo(this.constantPool, invokeDynamicRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo;
                    const bootstrapNameAndTypeRef = getConstantPoolInfo(this.constantPool, bootstrapMethod.nameAndTypeIndex).info as ConstantNameAndTypeInfo;
                    const implMethodHandle = getConstantPoolInfo(this.constantPool, bootstrapMethodAttr.bootstrapMethods[invokeDynamicRef.bootstrapMethodAttrIndex].bootstrapArguments[1]).info as ConstantMethodHandleInfo;
                    const implMethodNameAndType = getConstantPoolInfo(this.constantPool, (getConstantPoolInfo(this.constantPool, implMethodHandle.referenceIndex).info as ConstantMethodRefInfo).nameAndTypeIndex).info as ConstantNameAndTypeInfo;

                    const caller = this.thread.invokeMethod("lookup", "()Ljava/lang/invoke/MethodHandles$Lookup;", BootstrapClassLoader.getInstance().findClass("java.lang.invoke.MethodHandles"), [], null) as JavaObject;

                    console.log("A")
                    const invokedName = this.runtimeDataArea.createStringObject(this.thread, readUtf8FromConstantPool(this.constantPool, nameAndTypeRef.nameIndex));

                    console.log("B")
                    const invokedType = this.runtimeDataArea.createObject("java.lang.invoke.MethodType") as JavaObject;
                    const array = this.runtimeDataArea.createAArray("java.lang.Class", 0);
                    this.thread.invokeMethod("<init>", "([Ljava/lang/Class;Ljava/lang/Class;)V", invokedType.type, [
                        this.runtimeDataArea.createClassObject(this.thread, BootstrapClassLoader.getInstance().findClass("java.lang.Runnable")),
                        array
                    ], invokedType);

                    console.log("C")
                    const samMethodType = this.runtimeDataArea.createObject("java.lang.invoke.MethodType");
                    const array0 = this.runtimeDataArea.createAArray("java.lang.Class", 0);
                    this.thread.invokeMethod("<init>", "([Ljava/lang/Class;Ljava/lang/Class;)V", samMethodType.type, [
                        this.runtimeDataArea.createClassObject(this.thread, BootstrapClassLoader.getInstance().findClass("java.lang.Void")),
                        array0
                    ], samMethodType);

                    console.log("D")
                    const implMethod = this.thread.invokeMethod("findVirtual", "(Ljava/lang/Class;Ljava/lang/String;Ljava/lang/invoke/MethodType;)Ljava/lang/invoke/MethodHandle;", caller.type, [
                        invokedType,
                        this.runtimeDataArea.createStringObject(this.thread, readUtf8FromConstantPool(this.constantPool, implMethodNameAndType.nameIndex)),
                        this.runtimeDataArea.createClassObject(this.thread, this.javaClass)
                    ], caller);

                    console.log("E")
                    const instantiatedMethodType = this.runtimeDataArea.createObject("java.lang.invoke.MethodType");
                    const array1 = this.runtimeDataArea.createAArray("java.lang.Class", 0);
                    this.thread.invokeMethod("<init>", "([Ljava/lang/Class;Ljava/lang/Class;)V", instantiatedMethodType.type, [
                        this.runtimeDataArea.createClassObject(this.thread, BootstrapClassLoader.getInstance().findClass("java.lang.Void")),
                        array1
                    ], instantiatedMethodType);

                    console.log("F")
                    const callSite = this.thread.invokeMethod(
                        readUtf8FromConstantPool(this.constantPool, bootstrapNameAndTypeRef.nameIndex),
                        readUtf8FromConstantPool(this.constantPool, bootstrapNameAndTypeRef.descriptorIndex),
                        BootstrapClassLoader.getInstance().findClass(readUtf8FromConstantPool(this.constantPool, bootstrapMethodClass.nameIndex).split("/").join(".")),
                        [caller, invokedName, invokedType, samMethodType, implMethod, instantiatedMethodType],
                        null
                    ) as JavaObject;

                    console.log("G")
                    break;
                }

                // new
                case 0xbb: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const classRef = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2).info as ConstantClassInfo;
                    const className = readUtf8FromConstantPool(this.constantPool, classRef.nameIndex).split("/").join(".");

                    const object = this.runtimeDataArea.createObject(className);
                    object.init(this.runtimeDataArea);

                    this.operandStack.push(object);

                    break;
                }

                // newarray
                case 0xbc: {
                    const type = this.opcode.operands[0];
                    const count = this.operandStack.pop();
                    this.operandStack.push(this.runtimeDataArea.createPArray(type, count));
                    break;
                }

                // anewarray
                case 0xbd: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const classRef = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2).info as ConstantClassInfo;
                    const className = readUtf8FromConstantPool(this.constantPool, classRef.nameIndex);
                    const count = this.operandStack.pop();

                    this.operandStack.push(this.runtimeDataArea.createAArray(className.split("/").join("."), count));
                    break;
                }

                // arraylength
                case 0xbe: {
                    const array = this.operandStack.pop() as JavaObject;
                    if (!array.isArray) {
                        throw new Error("The stack values is not array object.");
                    }
                    this.operandStack.push((this.runtimeDataArea.objectHeap[array.heapIndex] as Array<any>).length)
                    break;
                }

                // athrow
                case 0xbf: {
                    let throwable = this.operandStack.pop() as JavaObject;
                    if (throwable == null) {
                        throwable = this.runtimeDataArea.createObject("java.lang.NullPointerException");
                    }

                    const codeAttributes =
                        this.method.attributes.filter(attribute => readUtf8FromConstantPool(this.constantPool, attribute.attributeNameIndex) === "Code");
                    if (!codeAttributes || codeAttributes.length == 0) {
                        console.error("CodeAttribute does not exist!");
                        break;
                    }

                    const codeAttribute = codeAttributes[0]!! as CodeAttribute;
                    const handlers = codeAttribute.exceptionTable.filter((value => {
                        if (value.catchType != 0) {
                            const catchType = this.constantPool[value.catchType].info as ConstantClassInfo;
                            return value.startPc <= this.opcode.id && this.opcode.id <= value.endPc
                                && readUtf8FromConstantPool(this.constantPool, catchType.nameIndex).split("/").join(".") === throwable.type.name;
                        } else {
                            return value.startPc <= this.opcode.id && this.opcode.id <= value.endPc;
                        }
                    }));

                    if (handlers.length > 0) {
                        const handler = handlers[0];
                        const result = this.executeOpcodes(handler.handlerPc);

                        this.operandStack = [];
                        this.operandStack.push(throwable);
                        return result;
                    }

                    break;
                }

                // checkcast
                case 0xc0: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const ref = getConstantPoolInfo(this.constantPool, (branchByte1 << 8) | branchByte2);
                    // TODO
                    break;
                }

                // monitorenter
                case 0xc2: {
                    // TODO
                    this.operandStack.pop();
                    break;
                }

                // monitorexit
                case 0xc3: {
                    // TODO
                    this.operandStack.pop();
                    break;
                }

                // multianewarray
                case 0xc5: {
                    const indexByte1 = this.opcode.operands[0];
                    const indexByte2 = this.opcode.operands[1];
                    const classRef = getConstantPoolInfo(this.constantPool, (indexByte1 << 8) | indexByte2).info as ConstantClassInfo;
                    const className = readUtf8FromConstantPool(this.constantPool, classRef.nameIndex);
                    const dimension = this.opcode.operands[2];
                    const sizes = new Array<number>(dimension);

                    for (let j = 0; j < dimension; j++) {
                        sizes[j] = this.operandStack.pop();
                    }

                    this.operandStack.push(this.runtimeDataArea.createMDArray(className.split("/").join("."), dimension, sizes));
                    break;
                }

                // ifnull
                case 0xc6: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const value = this.operandStack.pop();
                    if (value == null) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }

                // ifnonnull
                case 0xc7: {
                    const branchByte1 = this.opcode.operands[0];
                    const branchByte2 = this.opcode.operands[1];
                    const value = this.operandStack.pop();
                    if (value) {
                        return this.executeOpcodes(this.opcode.id + ((branchByte1 << 8) | branchByte2));
                    }
                    break;
                }
            }
        }
    }

    loadOpcodes() {
        const codeAttributes =
            this.method.attributes.filter(attribute => readUtf8FromConstantPool(this.constantPool, attribute.attributeNameIndex) === "Code");
        if (!codeAttributes || codeAttributes.length == 0) return;

        const codeAttribute = codeAttributes[0]!! as CodeAttribute;
        const code = codeAttribute.code;
        code.resetOffset();

        const name = readUtf8FromConstantPool(this.constantPool, this.method.nameIndex);

        let opcode: number;
        let id = 0;
        while (code.offset < code.getLength()) {
            opcode = code.getUint8()

            if (name == "isMethodHandleInvokeName") console.log(id)

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
                    })
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
                    const padding = (4 - (id + 1) % 4) % 4;
                    const operands = [];
                    let count = padding;
                    for (let i = 0; i < padding; i++) {
                        code.getUint8();  // padding
                    }

                    // defaultByte
                    const defaultNum = (code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8();
                    count += 4;

                    // lowByte
                    const lowNum = (code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8();
                    count += 4;

                    // highByte
                    const highNum = (code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8();
                    count += 4;

                    const n = highNum - lowNum + 1;

                    operands.push(defaultNum, lowNum, highNum);

                    // jump offsets
                    for (let i = 0; i < n; i++) {
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
                    const padding = (4 - (id + 1) % 4) % 4;
                    const operands = [];
                    let count = padding;
                    for (let i = 0; i < padding; i++) {
                        code.getUint8();  // padding
                    }

                    // defaultByte
                    operands.push((code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8());
                    count += 4;

                    // npairs
                    operands.push((code.getUint8() << 24) | (code.getUint8() << 16) | (code.getUint8() << 8) | code.getUint8());
                    count += 4;

                    // match-offset pairs
                    for (let i = 0; i < operands[1]; i++) {
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
    }

    private getClassName(packageName: string): string {
        const split = packageName.split("/");
        return split[split.length - 1];
    }

    getOpcodeIndexById(id: number): number {
        return this.opcodes.findIndex(opcode => opcode.id === id);
    }

    getOpcodeById(id: number): Opcode {
        return this.opcodes.filter(opcode => opcode.id === id)[0];
    }

}