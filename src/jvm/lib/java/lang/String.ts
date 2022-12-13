import Thread from "../../../core/rda/stack/Thread";
import JavaClass from "../../../core/cfl/JavaClass";
import {JavaObject, JavaVariable} from "../../../core/cfl/types";

export class String extends JavaObject {

    static intern(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        return obj;
    }

}