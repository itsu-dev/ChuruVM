import {Frame} from "./Frame.js";
import {throwErrorOrException} from "../../../jvm.js";
import {ConstantPoolInfo, readUtf8FromConstantPool} from "../../../models/info/ConstantPoolInfo.js";
import {MethodInfo} from "../../../models/info/MethodInfo.js";
import {CodeAttribute} from "../../../models/info/AttributeInfo.js";
import {PrimitiveArrayVariable} from "../../../models/Variable.js";
import {System} from "../../../lib/java/lang/System.js";
import RuntimeDataArea from "../RuntimeDataArea.js";
import {getArgumentsAndReturnType} from "../../cfl/ClassFileLoader.js";
import JavaClass, {Method} from "../../cfl/JavaClass";
import {JavaObject} from "../../cfl/types";
import {logMethod} from "../../../utils/Log";
import {throwException} from "../../../utils/ExceptionHandler";
import {JITCompiler} from "../../../jit/JITCompiler";

export default class Thread {

    stack: Array<Frame>;
    id: number;
    stackSize: number;
    private invokingNative = false;
    runtimeDataArea: RuntimeDataArea;

    constructor(runtimeDataArea: RuntimeDataArea, stackSize: number, id: number) {
        if (stackSize < 1) {
            console.log("StackSize must must be bigger than 1.");
            return;
        }

        this.runtimeDataArea = runtimeDataArea;
        this.stackSize = stackSize;
        this.stack = [];
        this.id = id;
    }

    private findMethod = (methodName: string, descriptor: string, klass: JavaClass): [MethodInfo, JavaClass] => {
        const method = klass.methodInfos.filter(value => {
            return readUtf8FromConstantPool(klass.constantPool, value.nameIndex) === methodName
                && ((descriptor === "") || descriptor === readUtf8FromConstantPool(klass.constantPool, value.descriptorIndex))
        })[0];
        if (method == null) {
            if (klass.superClass != null) {
                return this.findMethod(methodName, descriptor, klass.superClass);
            } else {
                return [null, null];
            }
        } else {
            return [method, klass];
        }
    }

    invokeMethod(methodName: string, descriptor: string, javaClass: JavaClass, args: Array<any>, javaObject: JavaObject | null = null): any {
        const [method, klass] = this.findMethod(methodName, descriptor, javaClass);
        if (method == null) {
            throwException("java.lang.NoSuchMethodError: " + javaClass.name + "." + methodName, this.runtimeDataArea);
            return;
        }

        // method is native
        if (method.accessFlags & 256) {
            return this.invokeNative(methodName, method, javaClass, args, javaObject);
        }

        const codeAttributes =
            method.attributes.filter(attribute => readUtf8FromConstantPool(klass.constantPool, attribute.attributeNameIndex) === "Code");

        if (!codeAttributes || codeAttributes.length == 0) {
            return;
        }

        const codeAttribute = codeAttributes[0]!! as CodeAttribute;
        const code = codeAttribute.code;
        code.resetOffset();

        const argsCount = getArgumentsAndReturnType(readUtf8FromConstantPool(klass.constantPool, method.descriptorIndex))[0].length;

        const frame = new Frame(this, this.runtimeDataArea, method, klass, codeAttribute.maxLocals - argsCount, klass.constantPool, args, javaObject);
        this.runtimeDataArea.incrementPCRegister(this.id);
        this.stack.push(frame);

        if (this.stack.length > this.stackSize) {
            throwException("java.lang.StackOverFlowError", this.runtimeDataArea);
            return;
        }

        logMethod("CALL", klass.name, readUtf8FromConstantPool(klass.constantPool, method.nameIndex));
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
        const result = frame.execute();

        this.stack.pop();

        return result;
    }

    private invokeNative(methodName: string, method: MethodInfo, javaClass: JavaClass, args: Array<any>, javaObject: JavaObject | null = null) {
        this.invokingNative = true;
        logMethod("NATIVECALL", javaClass.name, methodName);
        let module = this.runtimeDataArea.nativeModules[javaClass.name]; // await import("../../../lib/" + javaClass.name.split(".").join("/") + ".js");

        // TODO
        if (methodName === "getClass") {
            return this.runtimeDataArea.nativeModules["java.lang.Object"]["JavaObject"]["getClass"](this, javaClass, javaObject);
        } else if (methodName === "hashCode") {
            return this.runtimeDataArea.nativeModules["java.lang.Object"]["JavaObject"]["hashCode"](this, javaClass, javaObject);
        } else if (methodName === "notifyAll") {
            return this.runtimeDataArea.nativeModules["java.lang.Object"]["JavaObject"]["notifyAll"](this, javaClass, javaObject);
        }

        if (module == null) {
            throwException("java.lang.ClassNotFoundException: " + javaClass.name, this.runtimeDataArea);
            return;
        }

        if (module[javaClass.getSimpleName()][methodName] == null) {
            throwException("java.lang.NoSuchMethodError: " + javaClass.name + "." + methodName, this.runtimeDataArea);
            return;
        }

        return module[javaClass.getSimpleName()][methodName](this, javaClass, javaObject, ...args.reverse());
    }

}
