import JavaClass from "../../../core/cfl/JavaClass";
import Thread from "../../../core/rda/stack/Thread";
import {JavaObject as Object} from "../../java/lang/JavaObject";
import {JavaObject, JavaVariable} from "../../../core/cfl/types";
import {getFieldValue, getString} from "../../../utils/Utils";
import BootstrapClassLoader from "../../../core/BootstrapClassLoader";


export class Unsafe extends Object {

    static registerNatives(thread: Thread, klass: JavaClass, obj: JavaObject) {

    }

    static arrayBaseOffset(thread: Thread, klass: JavaClass, obj: JavaObject, clazz: JavaObject) {
        return 0;
    }

    static arrayIndexScale(thread: Thread, klass: JavaClass, obj: JavaObject, clazz: JavaObject) {
        return 0;
    }

    static addressSize(thread: Thread, klass: JavaClass, obj: JavaObject) {
        return 4;
    }

    static isBigEndian0(thread: Thread, klass: JavaClass, obj: JavaObject) {
        return 1;
    }

    static unalignedAccess0(thread: Thread, klass: JavaClass, obj: JavaObject) {
        return 0;
    }

    static allocateMemory(thread: Thread, klass: JavaClass, obj: JavaObject, size: number) {
        return thread.runtimeDataArea.allocate(size);
    }


    static freeMemory(thread: Thread, klass: JavaClass, obj: JavaObject, ptr: number) {
        thread.runtimeDataArea.objectHeap[ptr] = null;
    }

    static putLong(thread: Thread, klass: JavaClass, obj: JavaObject, ptr: number, x: bigint) {
        const array = new ArrayBuffer(8);
        const view = new DataView(array);
        view.setBigUint64(0, x, false);
        return thread.runtimeDataArea.objectHeap[ptr] = Array.from(new Uint8Array(array));
    }

    static getByte(thread: Thread, klass: JavaClass, obj: JavaObject, ptr: number) {
        return (thread.runtimeDataArea.objectHeap[ptr] as Array<number>)[0];
    }

    static objectFieldOffset(thread: Thread, klass: JavaClass, obj: JavaObject, _field: JavaObject) {
        const declaringClassName = getString(thread.runtimeDataArea, getFieldValue(getFieldValue(_field, "clazz"), "name"));
        const declaringClass = BootstrapClassLoader.getInstance().findClass(declaringClassName);
        const name = getString(thread.runtimeDataArea, getFieldValue(_field, "name"));
        let index = 0;
        for (let declaredField of declaringClass.getDeclaredFields()) {
            if (declaredField.name == name) {
                return index;
            }
            index++;
        }
        return -1;
    }

    static compareAndSwapObject(thread: Thread, klass: JavaClass, obj: JavaObject, _o: JavaObject, _offset: number, _expected: JavaObject, _x: JavaObject) {
        const variable = (thread.runtimeDataArea.objectHeap[_o.heapIndex] as JavaVariable[]).filter(v => v.name === _o.type.getDeclaredFields()[_offset].name)[0];

        let hash1 = 0;
        if (variable.value != null) hash1 = Object.hashCode(thread, BootstrapClassLoader.getInstance().findClass(variable.typeName.substring(1)), variable.value as JavaObject);

        let hash2 = 0;
        if (_expected != null) hash2 = Object.hashCode(thread, _expected.type, _expected);

        if (hash1 == hash2) {
            variable.value = _x;
            return true;
        }

        return false;
    }

    static compareAndSwapInt(thread: Thread, klass: JavaClass, obj: JavaObject, _o: JavaObject, _offset: number, _expected: number, _x: number) {
        const variable = (thread.runtimeDataArea.objectHeap[_o.heapIndex] as JavaVariable[]).filter(v => v.name === _o.type.getDeclaredFields()[_offset].name)[0];

        if (variable.value == _expected) {
            variable.value = _x;
            return true;
        }

        return false;
    }

    static getObjectVolatile(thread: Thread, klass: JavaClass, obj: JavaObject, _o: JavaObject, _offset: number) {
        return (thread.runtimeDataArea.objectHeap[_o.heapIndex] as JavaVariable[])
            .filter(v => v.name === _o.type.getDeclaredFields()[_offset].name)[0]
            .value;
    }
}