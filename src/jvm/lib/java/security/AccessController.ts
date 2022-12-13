import {JavaObject} from "../../../core/cfl/types";
import Thread from "../../../core/rda/stack/Thread";
import JavaClass from "../../../core/cfl/JavaClass";

export class AccessController extends JavaObject {

    static doPrivileged(thread: Thread, klazz: JavaClass, obj: JavaObject, action: JavaObject) {
        return thread.invokeMethod("run", "", action.type, [], action);
    }

}