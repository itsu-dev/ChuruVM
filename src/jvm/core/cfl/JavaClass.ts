import {
    CONSTANT_CLASS,
    ConstantClassInfo,
    ConstantPoolInfo,
    readUtf8FromConstantPool
} from "../../models/info/ConstantPoolInfo";
import {FieldInfo} from "../../models/info/FieldInfo";
import {MethodInfo} from "../../models/info/MethodInfo";
import ClassFile from "./ClassFile";
import BootstrapClassLoader, {getArgumentsAndReturnType} from "../BootstrapClassLoader";
import {CodeAttribute} from "../../models/info/AttributeInfo";
import {JavaObject} from "./types";
import Thread from "../rda/stack/Thread";

export default class JavaClass extends ClassFile {

    private initialized: boolean;
    readonly name: string;
    private declaredFields: Field[] = [];
    private declaredMethods: Method[] = [];
    superClass: JavaClass | null = null;
    private initializedStatic: boolean = false;
    private classObject: JavaObject | null = null;

    constructor(
        name: string
    ) {
        super();
        this.name = name;
    }

    init() {
        if (this.initialized) return;

        // initialize fields
        this.fieldInfos.forEach(value => this.declaredFields.push(new Field(this, value)));

        // initialize methods
        this.methodInfos.forEach(value => this.declaredMethods.push(new Method(this, value)));

        // set superclass recursively
        this.setSuperClass(this.superClassIndex);

        this.initialized = true;
    }

    initStatic(thread: Thread) {
        if (!this.initializedStatic && this.getDeclaredMethod("<clinit>") !== null) {
            this.initializedStatic = true;
            thread.invokeMethod("<clinit>", "()V", this, [], null);
        }
    }

    private setSuperClass(superClassIndex: number) {
        // if this class is java.lang.Object
        if (superClassIndex == 0) {
            this.superClass = null;
            return;
        }

        const name = readUtf8FromConstantPool(
            this.constantPool,
            (this.constantPool.filter(value => value.id == superClassIndex)[0].info as ConstantClassInfo).nameIndex
        ).split("/").join(".");

        this.superClass = BootstrapClassLoader.getInstance().findClass(name);
    }

    getSimpleName(): string {
        return this.name.split(".").reverse()[0];
    }

    getDeclaredField(name: string): Field | null {
        return this.declaredFields.filter(value => value.name == name)?.[0];
    }

    getDeclaredFields(): Field[] {
        return this.declaredFields;
    }

    getFields(): Field[] {
        const result = [];

        const addSuperClassFields = (javaClass: JavaClass): Field[] => {
            if (javaClass.superClass !== null) {
                result.push(...javaClass.declaredFields);
                addSuperClassFields(javaClass.superClass);
            }
            return javaClass.declaredFields;
        }

        addSuperClassFields(this);

        return result;
    }

    getDeclaredMethod(name: string): Method | null {
        return this.declaredMethods.filter(value => value.name == name)?.[0];
    }

    getMethods(): Method[] {
        const result = [];

        const addSuperClassMethods = (javaClass: JavaClass): Method[] => {
            if (javaClass.superClass !== null) {
                result.push(...javaClass.declaredMethods);
                addSuperClassMethods(javaClass.superClass);
            }
            return javaClass.declaredMethods;
        }

        addSuperClassMethods(this);

        return result;
    }

    setClassObject(obj: JavaObject) {
        if (this.classObject == null) this.classObject = obj;
    }

    getClassObject(): JavaObject | null {
        return this.classObject;
    }

    private static wrapperMapping = {
        "B": "java.lang.Byte",
        "C": "java.lang.Character",
        "D": "java.lang.Double",
        "F": "java.lang.Float",
        "I": "java.lang.Integer",
        "J": "java.lang.Long",
        "S": "java.lang.Short",
        "Z": "java.lang.Boolean"
    }

    private static wrappers = [
        "java.lang.Byte",
        "java.lang.Character",
        "java.lang.Double",
        "java.lang.Float",
        "java.lang.Integer",
        "java.lang.Long",
        "java.lang.Short",
        "java.lang.Boolean"
    ]

    private static primitives = {
        "byte": "java.lang.Byte",
        "char": "java.lang.Character",
        "double": "java.lang.Double",
        "float": "java.lang.Float",
        "int": "java.lang.Integer",
        "long": "java.lang.Long",
        "short": "java.lang.Short",
        "boolean": "java.lang.Boolean",
        "void": "java.lang.Void"
    }

    static isPrimitive(className: string): boolean {
        return !(this.wrapperMapping[className] == null);
    }

    static isWrappedPrimitive(className: string): boolean {
        return this.wrappers.includes(className);
    }

    static getPrimitiveName(className: string): string {
        return this.primitives[className];
    }

    static box(className: string): string {
        return this.wrapperMapping[className];
    }

    getFieldsCount(): number {
        return this.getFields().length;
    }

}

export class Member {

    readonly declaringClass: JavaClass;
    readonly typeName : string;
    readonly modifiers: number;
    readonly name: string;
    readonly synthetic: boolean;

    protected constructor(
        declaringClass: JavaClass,
        typeName: string,
        modifiers: number,
        name: string,
        synthetic: boolean
    ) {
        this.declaringClass = declaringClass;
        this.typeName = typeName;
        this.modifiers = modifiers;
        this.name = name;
        this.synthetic = synthetic;
    }

}

export class Field extends Member {

    staticValue: JavaObject;

    constructor(
        declaringClass: JavaClass,
        info: FieldInfo
    ) {
        super(
            declaringClass,
            getArgumentsAndReturnType(readUtf8FromConstantPool(declaringClass.constantPool, info.descriptorIndex))[1].split("/").join("."),
            info.accessFlags,
            readUtf8FromConstantPool(declaringClass.constantPool, info.nameIndex),
            false
        );
    }

}

export class Executable {

    readonly declaredClass: JavaClass;
    readonly parameterCount: number;
    readonly modifiers: number;
    readonly name: string;
    readonly synthetic: boolean;
    readonly varArgs: boolean;

    constructor(
        declaredClass: JavaClass,
        parameterCount: number,
        modifiers: number,
        name: string,
        synthetic: boolean,
        varArgs: boolean
    ) {
        this.declaredClass = declaredClass;
        this.parameterCount = parameterCount;
        this.modifiers = modifiers;
        this.name = name;
        this.synthetic = synthetic;
        this.varArgs = varArgs;
    }

}

export class Method extends Executable {
    constructor(
        declaredClass: JavaClass,
        methodInfo: MethodInfo
    ) {
        super(
            declaredClass,
            getArgumentsAndReturnType(readUtf8FromConstantPool(declaredClass.constantPool, methodInfo.descriptorIndex))[0].length,
            methodInfo.accessFlags,
            readUtf8FromConstantPool(declaredClass.constantPool, methodInfo.nameIndex),
            false,
            false
        );
    }
}
