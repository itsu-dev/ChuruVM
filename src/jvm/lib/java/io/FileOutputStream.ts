import {JavaObject, JavaVariable} from "../../../core/cfl/types";
import Thread from "../../../core/rda/stack/Thread";
import JavaClass from "../../../core/cfl/JavaClass";
import {OutputLogger} from "../../../utils/OutputLogger";

export class FileOutputStream extends JavaObject {

    private static _writeOut(thread: Thread, b: JavaObject, off: number, len: number) {
        const bytes = thread.runtimeDataArea.objectHeap[b.heapIndex] as Array<number>;
        for (let i = off; i < off + len; i++) {
            let byte = bytes[i];
            OutputLogger.write(String.fromCharCode(byte));
        }
    }

    static writeBytes(thread: Thread, klass: JavaClass, obj: JavaObject, b: JavaObject, off: number, len: number, append: boolean) {
        const fileDescriptor = (thread.runtimeDataArea.objectHeap[obj.heapIndex] as JavaVariable[]).filter(v => v.name === "fd")[0].value as JavaObject;
        const fd = (thread.runtimeDataArea.objectHeap[fileDescriptor.heapIndex] as JavaVariable[]).filter(v => v.name === "handle")[0].value
        if (fd == 1) this._writeOut(thread, b, off, len);
    }

}