import JavaClass from "../../../core/cfl/JavaClass";
import JVMThread from "../../../core/rda/stack/Thread";
import {JavaObject, JavaVariable} from "../../../core/cfl/types";

export class Thread extends JavaObject {

    private static current: JavaObject = null;

    static init(thread: JVMThread) {
        if (this.current == null) {
            const threadGroup = thread.runtimeDataArea.createObject("java.lang.ThreadGroup");
            thread.invokeMethod("<init>", "()V", threadGroup.type, [], threadGroup);

            const currentThread = thread.runtimeDataArea.createObject("java.lang.Thread");
            const variables = thread.runtimeDataArea.objectHeap[currentThread.heapIndex] as JavaVariable[];
            variables.filter(v => v.name == "group")[0].value = threadGroup;
            variables.filter(v => v.name == "name")[0].value = thread.runtimeDataArea.createStringObject(thread, "main");
            variables.filter(v => v.name == "priority")[0].value = 5;

            this.current = currentThread;
        }
    }

    static registerNatives(thread: JVMThread, klass: JavaClass, obj: JavaObject) {
        // klass.getDeclaredField("in").staticValue = inputStream;
    }

    static currentThread(thread: JVMThread, klass: JavaClass, obj: JavaObject) {
        if (this.current == null) {
            const threadGroup = thread.runtimeDataArea.createObject("java.lang.ThreadGroup");
            thread.invokeMethod("<init>", "()V", threadGroup.type, [], threadGroup);

            const currentThread = thread.runtimeDataArea.createObject("java.lang.Thread");
            const variables = thread.runtimeDataArea.objectHeap[currentThread.heapIndex] as JavaVariable[];
            variables.filter(v => v.name == "group")[0].value = threadGroup;
            variables.filter(v => v.name == "name")[0].value = thread.runtimeDataArea.createStringObject(thread, "main");
            variables.filter(v => v.name == "priority")[0].value = 5;

            this.current = currentThread;
        }
        return this.current;
    }

}