import {PrintStream} from "../io/PrintStream.js";
import {JavaObject} from "../../../core/cfl/types";
import Thread from "../../../core/rda/stack/Thread";
import RuntimeDataArea from "../../../core/rda/RuntimeDataArea";
import JavaClass from "../../../core/cfl/JavaClass";
import {isPrimitive} from "util";
import {throwException} from "../../../utils/ExceptionHandler";

export class System extends JavaObject {

    static registerNatives(thread: Thread, klass: JavaClass, obj: JavaObject) {
        // TODO
    }

    static setIn0(thread: Thread, klass: JavaClass, obj: JavaObject, inputStream: JavaObject) {
        klass.getDeclaredField("in").staticValue = inputStream;
    }

    static setOut0(thread: Thread, klass: JavaClass, obj: JavaObject, printStream: JavaObject) {
        klass.getDeclaredField("out").staticValue = printStream;
    }

    static setErr0(thread: Thread, klass: JavaClass, obj: JavaObject, printStream: JavaObject) {
        klass.getDeclaredField("err").staticValue = printStream;
    }

    static initProperties(thread: Thread, klass: JavaClass, obj: JavaObject, properties: JavaObject) {
        // const lineSeparator = await createString(thread.runtimeDataArea, "line.separator");
        const fileEncodingKey = thread.runtimeDataArea.createStringObject(thread, "file.encoding");
        const fileEncodingValue = thread.runtimeDataArea.createStringObject(thread, "UTF-8");
        thread.invokeMethod("setProperty", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/Object;", properties.type, [fileEncodingValue, fileEncodingKey], properties);

        const lineSeparatorKey = thread.runtimeDataArea.createStringObject(thread, "line.separator");
        const lineSeparatorValue = thread.runtimeDataArea.createStringObject(thread, "\n");
        thread.invokeMethod("setProperty", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/Object;", properties.type, [lineSeparatorValue, lineSeparatorKey], properties);
        return properties;
    }

    static arraycopy(thread: Thread, klass: JavaClass, obj: JavaObject, src: JavaObject, srcPos: number, dest: JavaObject, destPos: number, length: number) {
        if (src == null) {
            throwException("java.lang.NullPointerException: src", thread.runtimeDataArea);
            return;
        }

        if (dest == null) {
            throwException("java.lang.NullPointerException: dest", thread.runtimeDataArea);
            return;
        }

        if (!src.isArray || !dest.isArray
            || ((JavaClass.isWrappedPrimitive(src.type.name) && JavaClass.isWrappedPrimitive(dest.type.name)) && src.type.name !== src.type.name)) {
            throwException("java.lang.ArrayStoreException", thread.runtimeDataArea);
            return;
        }

        const srcArray = thread.runtimeDataArea.objectHeap[src.heapIndex] as Array<any>;
        const destArray = thread.runtimeDataArea.objectHeap[dest.heapIndex] as Array<any>;

        if (srcPos < 0 || destPos < 0 || length < 0 || srcArray.length < srcPos + length || destArray.length < destPos + length) {
            throwException("java.lang.IndexOutOfBoundsException", thread.runtimeDataArea);
            return;
        }

        for (let i = 0; i < length; i++) {
            destArray[destPos + i] = srcArray[srcPos + i];
        }

        return;
    }

}