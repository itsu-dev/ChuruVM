import JavaClass from "../../../core/cfl/JavaClass";
import Thread from "../../../core/rda/stack/Thread";
import {JavaObject} from "../../java/lang/JavaObject";

export class Reflection extends JavaObject {

    static initialize(thread: Thread, klass: JavaClass, obj: JavaObject) {
        // klass.getDeclaredField("in").staticValue = inputStream;
    }

    static getCallerClass(thread: Thread, klass: JavaClass, obj: JavaObject) {
        // TODO
        return thread.runtimeDataArea.createClassObject(thread, thread.stack[thread.stack.length - 2].javaClass);
    }

}