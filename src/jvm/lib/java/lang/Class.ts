import Thread from "../../../core/rda/stack/Thread";
import JavaClass from "../../../core/cfl/JavaClass";
import {JavaObject, JavaVariable} from "../../../core/cfl/types";
import {getFieldValue, getString} from "../../../utils/Utils";
import BootstrapClassLoader, {getConstantPoolInfo} from "../../../core/BootstrapClassLoader";
import {
    ConstantClassInfo,
    ConstantNameAndTypeInfo,
    readUtf8FromConstantPool
} from "../../../models/info/ConstantPoolInfo";
import {EnclosingMethodAttribute} from "../../../models/info/AttributeInfo";

export class Class extends JavaObject {

    static registerNatives(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        return;
    }

    static getClassLoader0(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        // TODO
        return null;
    }

    static forName0(thread: Thread, klazz: JavaClass, obj: JavaObject, name: JavaObject, initialize: boolean, loader: JavaObject, caller: JavaObject) {
        const name0 = getString(thread.runtimeDataArea, name);
        return thread.runtimeDataArea.createClassObject(thread, BootstrapClassLoader.getInstance().findClass(name0));
    }

    static desiredAssertionStatus0(thread: Thread, klazz: JavaClass, obj: JavaObject, clazz: JavaObject) {
        // TODO
        return true;
    }

    static isInterface(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        return klazz.accessFlags & 512;
    }

    static isAssignableFrom(thread: Thread, klazz: JavaClass, obj: JavaObject, _cls: JavaObject) {
        return klazz.name == _cls.type.name || klazz.superClass?.name == _cls.type.name;
    }

    static getPrimitiveClass(thread: Thread, klazz: JavaClass, obj: JavaObject, name: JavaObject) {
        const name0 = getString(thread.runtimeDataArea, name);
        return thread.runtimeDataArea.createClassObject(thread, BootstrapClassLoader.getInstance().findClass(name0));
    }

    static isArray(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        return obj.isArray;
    }

    static getComponentType(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        console.log(obj.isArray, klazz.name)
        return thread.runtimeDataArea.createClassObject(thread, obj.type);
    }

    /*
    @return Object[]?
    Object[0]: Class<?> enclosingClass
    Object[1]: String name
    Object[2]: String descriptor
     */
    static getEnclosingMethod0(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        const enclosingMethodAttrs = klazz.attributes.filter(attr => readUtf8FromConstantPool(klazz.constantPool, attr.attributeNameIndex) === "EnclosingMethod");

        if (enclosingMethodAttrs.length == 0) return null;

        const enclosingMethodAttr = enclosingMethodAttrs[0] as EnclosingMethodAttribute;
        const nameAndTypeInfo = getConstantPoolInfo(klazz.constantPool, enclosingMethodAttr.methodIndex).info as ConstantNameAndTypeInfo;
        const classInfo = getConstantPoolInfo(klazz.constantPool, enclosingMethodAttr.classIndex).info as ConstantClassInfo;
        const clazz = BootstrapClassLoader.getInstance().findClass(readUtf8FromConstantPool(klazz.constantPool, classInfo.nameIndex).split("/").join("."));
        const name = thread.runtimeDataArea.createStringObject(thread, readUtf8FromConstantPool(klazz.constantPool, nameAndTypeInfo.nameIndex));
        const descriptor = thread.runtimeDataArea.createStringObject(thread, readUtf8FromConstantPool(klazz.constantPool, nameAndTypeInfo.descriptorIndex));
        const array = thread.runtimeDataArea.objectHeap[thread.runtimeDataArea.createAArray("java.lang.Object", 3).heapIndex] as Array<any>;

        array.push([clazz, name, descriptor]);

        return array;
    }

    static getDeclaringClass0(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        const split = klazz.name.split(".");
        const names = split[split.length - 1].split("$");

        if (names.length == 1) return null;

        let enclosingClassName = "";
        for (let i = 0; i < split.length - 1; i++) {
            enclosingClassName += split[i] + ".";
        }
        for (let i = 0; i < names.length - 1; i++) {
            enclosingClassName += names[i] + ".";
        }
        enclosingClassName = enclosingClassName.substring(0, enclosingClassName.length - 2);

        return thread.runtimeDataArea.createClassObject(thread, BootstrapClassLoader.getInstance().findClass(enclosingClassName));
    }

    static getModifiers(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        return klazz.accessFlags;
    }

    static getDeclaredFields0(thread: Thread, klazz: JavaClass, obj: JavaObject, _publicOnly: boolean) {
        const clazz = BootstrapClassLoader.getInstance().findClass(getString(thread.runtimeDataArea, getFieldValue(obj, "name")));
        const array = thread.runtimeDataArea.createAArray("java.lang.reflect.Field", clazz.getDeclaredFields().length);
        clazz.getDeclaredFields().forEach((field, index) => {
            // TODO publiconly
           const obj = thread.runtimeDataArea.createObject("java.lang.reflect.Field");
           const args = [];

           args.push(thread.runtimeDataArea.createClassObject(thread, field.declaringClass));
           args.push(thread.runtimeDataArea.createStringObject(thread, field.name));
           args.push(thread.runtimeDataArea.createClassObject(thread, BootstrapClassLoader.getInstance().findClass(field.typeName)));
           args.push(field.modifiers);
           args.push(0);
           args.push(thread.runtimeDataArea.createStringObject(thread, ""));
           args.push(thread.runtimeDataArea.createPArray(8, 0));

           thread.invokeMethod("<init>", "(Ljava/lang/Class;Ljava/lang/String;Ljava/lang/Class;IILjava/lang/String;[B)V", obj.type, args.reverse(), obj);
            (thread.runtimeDataArea.objectHeap[array.heapIndex] as JavaObject[])[index] = obj;
        });
        return array;
    }

    static isPrimitive(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        const clazz = BootstrapClassLoader.getInstance().findClass(getString(thread.runtimeDataArea, getFieldValue(obj, "name")));
        console.log(clazz.name)
        return JavaClass.isWrappedPrimitive(clazz.name);
    }
}