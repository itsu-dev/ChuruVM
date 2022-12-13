import JavaClass from "../../../core/cfl/JavaClass";
import Thread from "../../../core/rda/stack/Thread";
import {JavaObject} from "../../java/lang/JavaObject";

export class VM extends JavaObject {

    static initialize(thread: Thread, klass: JavaClass, obj: JavaObject) {
        // klass.getDeclaredField("in").staticValue = inputStream;
    }

}