import ClassFile from "../cfl/ClassFile.js";
import Thread from "./stack/Thread.js";
import JavaClass from "../cfl/JavaClass";
import {JavaObject, JavaVariable} from "../cfl/types";
import {JarFile} from "../../models/JarFile";
import BootstrapClassLoader from "../BootstrapClassLoader";
import {ConstantStringInfo, readUtf8FromConstantPool} from "../../models/info/ConstantPoolInfo";
import {cyrb53, hashString} from "../../utils/Utils";

export default class RuntimeDataArea {

    private threadId: number;
    private readonly stackArea: {[key: number]: Promise<Thread>};
    private readonly pcRegisters: {[key: number]: number};
    private currentThread: Thread;
    readonly classHeap: { [key: string]: JavaClass };
    readonly objectHeap: (JavaVariable[] | Array<boolean | number | JavaObject>)[];
    readonly loadedJars: JarFile[];
    readonly loadedClasses: {[key: string]: Uint8Array};
    readonly nativeModules: {[key: string]: {}};

    constructor() {
        this.threadId = 1;
        this.stackArea = {};
        this.pcRegisters = {};
        this.classHeap = {};
        this.objectHeap = [];
        this.loadedJars = [];
        this.loadedClasses = {}
        this.nativeModules = {};
    }

    async registerNatives() {
        this.nativeModules["dev.itsu.Document"] = await import("../../lib/dev/itsu/Document.js");
        this.nativeModules["dev.itsu.$"] = await import("../../lib/dev/itsu/$.js");
        this.nativeModules["dev.itsu.node.Element"] = await import("../../lib/dev/itsu/node/Element.js");
        this.nativeModules["dev.itsu.node.html.HTMLElement"] = await import("../../lib/dev/itsu/node/html/HTMLElement.js");
        this.nativeModules["dev.itsu.node.html.HTMLInputElement"] = await import("../../lib/dev/itsu/node/html/HTMLInputElement.js")
        this.nativeModules["dev.itsu.event.EventTarget"] = await import("../../lib/dev/itsu/event/EventTarget.js");
        this.nativeModules["java.io.FileDescriptor"] = await import("../../lib/java/io/FileDescriptor.js");
        this.nativeModules["java.io.FileOutputStream"] = await import("../../lib/java/io/FileOutputStream.js");
        this.nativeModules["java.lang.Class"] = await import("../../lib/java/lang/Class.js");
        this.nativeModules["java.lang.Object"] = await import("../../lib/java/lang/JavaObject.js");
        this.nativeModules["java.lang.Runtime"] = await import("../../lib/java/lang/Runtime.js");
        this.nativeModules["java.lang.String"] = await import("../../lib/java/lang/String.js");
        this.nativeModules["java.lang.System"] = await import("../../lib/java/lang/System.js");
        this.nativeModules["java.lang.Thread"] = await import("../../lib/java/lang/Thread.js");
        this.nativeModules["java.lang.invoke.MethodHandleNatives"] = await import("../../lib/java/lang/invoke/MethodHandleNatives.js");
        this.nativeModules["java.security.AccessController"] = await import("../../lib/java/security/AccessController.js");
        this.nativeModules["sun.misc.VM"] = await import("../../lib/sun/misc/VM.js");
        this.nativeModules["sun.misc.Unsafe"] = await import("../../lib/sun/misc/Unsafe.js");
        this.nativeModules["sun.reflect.Reflection"] = await import("../../lib/sun/reflect/Reflection.js");
    }

    createThread(stackSize: number, isCurrent: boolean): Promise<Thread> {
        this.stackArea[this.threadId] = new Promise<Thread>(resolve => {
            const thread = new Thread(this, stackSize, this.threadId);
            if (isCurrent) {
                this.currentThread = thread;
            }
            resolve(thread);
        })
        this.pcRegisters[this.threadId] = 0;
        this.threadId++;
        return this.stackArea[this.threadId - 1];
    }

    getThreadPromise(threadId: number): Promise<Thread> {
        return this.stackArea[threadId];
    }

    setPCRegister(threadId: number, value: number) {
        this.pcRegisters[threadId] = value;
    }

    incrementPCRegister(threadId: number) {
        this.pcRegisters[threadId]++;
    }

    getPCRegister(threadId: number): number {
        return this.pcRegisters[threadId];
    }

    createObject(className: string): JavaObject {
        if (JavaClass.isPrimitive(className)) className = JavaClass.box(className);
        const javaClass = BootstrapClassLoader.getInstance().findClass(className);
        const variables = new Array<JavaVariable>(javaClass.getFieldsCount());
        this.objectHeap.push(variables);
        if (document.getElementById("heap"))
            (document.getElementById("heap") as HTMLDivElement).innerHTML += `<span>${this.objectHeap.length - 1}: ${className}<br /></span>`;
        const obj = new JavaObject(BootstrapClassLoader.getInstance().findClass(javaClass.name), this.objectHeap.length - 1);
        obj.init(this);
        return obj;
    }

    createStringObject(thread: Thread, str: string): JavaObject {
        const object = this.createObject("java.lang.String");

        const variables = this.objectHeap[object.heapIndex] as JavaVariable[];
        const valueVar = variables.filter(value => value.name === "value")[0];
        valueVar.value = this._createPArray(8, Array.from(new TextEncoder().encode(str)));

        const hashVar = variables.filter(value => value.name === "hash")[0];
        hashVar.value = hashString(str);

        thread.invokeMethod("<init>", "(Ljava/lang/String;)V", object.type, [object], object);

        return object;
    }

    createClassObject(thread: Thread, klass: JavaClass): JavaObject {
        if (klass.getClassObject() != null) return klass.getClassObject();

        const object = this.createObject("java.lang.Class");
        object.init(this);

        thread.invokeMethod("<init>", "(Ljava/lang/ClassLoader;)V", object.type, [null], object);

        const variables = this.objectHeap[object.heapIndex] as JavaVariable[];
        variables.filter(value => value.name === "name")[0].value = this.createStringObject(thread, klass.name);

        /*
        const reverse = klass.name.split(".").reverse();
        reverse.pop();
        variables.filter(value => value.name === "packageName")[0].value = reverse.reverse().join(".");

         */

        variables.filter(value => value.name === "classLoader")[0].value = null;

        klass.setClassObject(object);

        return object;
    }

    private _createPArray(type: number, array: Array<boolean | number>): JavaObject {
        this.objectHeap.push(array);

        let classes = {
            8: "java.lang.Byte",
            5: "java.lang.Character",
            7: "java.lang.Double",
            6: "java.lang.Float",
            10: "java.lang.Integer",
            11: "java.lang.Long",
            9: "java.lang.Short",
            4: "java.lang.Boolean"
        }

        return new JavaObject(BootstrapClassLoader.getInstance().findClass(classes[type]), this.objectHeap.length - 1, true);
    }

    createPArray(type: number, size: number): JavaObject {
        let variables: Array<boolean | number>;
        let classes = {
            8: "java.lang.Byte",
            5: "java.lang.Character",
            7: "java.lang.Double",
            6: "java.lang.Float",
            10: "java.lang.Integer",
            11: "java.lang.Long",
            9: "java.lang.Short",
            4: "java.lang.Boolean"
        }

        if (type == 4) {
            variables = new Array<boolean>(size).fill(false);
        } else {
            variables = new Array<number>(size).fill(0);
        }

        this.objectHeap.push(variables);

        return new JavaObject(BootstrapClassLoader.getInstance().findClass(classes[type]), this.objectHeap.length - 1, true);
    }

    createAArray(typeName: string, size: number): JavaObject {
        const objects = new Array<JavaObject>(size).fill(null);
        this.objectHeap.push(objects);
        return new JavaObject(BootstrapClassLoader.getInstance().findClass(typeName), this.objectHeap.length - 1, true);
    }

    allocate(size: number) {
        const memory = new Array<number>(size);
        this.objectHeap.push(memory)
        return this.objectHeap.length - 1;
    }

    private _createMDArray(typeName: string, dimension: number, sizes: number[]) {
        let initValue = null;

        if (JavaClass.isPrimitive(typeName) || JavaClass.isWrappedPrimitive(typeName)) {
            initValue = 0;
            if (typeName.includes("Boolean") || typeName.includes("Z")) {
                initValue = false;
            }
        }

        if (dimension > 0) {
            return new Array<any>(sizes[sizes.length - dimension]).fill(this._createMDArray(typeName, dimension - 1, sizes));
        } else {
            return initValue;
        }
    }

    createMDArray(typeName: string, dimension: number, sizes: number[]): JavaObject {
        const objects = this._createMDArray(typeName, dimension, sizes);
        this.objectHeap.push(objects);
        return new JavaObject(BootstrapClassLoader.getInstance().findClass(typeName), this.objectHeap.length - 1, true);
    }

    getCurrentThread(): Thread {
        return this.currentThread;
    }

}