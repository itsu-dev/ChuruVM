import {JavaObject} from "../../../core/cfl/types";
import JavaClass from "../../../core/cfl/JavaClass";
import Thread from "../../../core/rda/stack/Thread";
import {JavaVariable} from "../../../core/cfl/types";

export class FileDescriptor extends JavaObject {

    static async initIDs(thread: Thread, klass: JavaClass, obj: JavaObject) {
        // TODO
    }

    static set(thread: Thread, klass: JavaClass, obj: JavaObject, fd: number) {
        return fd;
    }

    static async sync(thread: Thread, klass: JavaClass, obj: JavaObject) {
        // klass.getDeclaredField("in").staticValue = inputStream;
    }

}