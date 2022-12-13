import {JavaObject, JavaVariable} from "../../../core/cfl/types";
import Thread from "../../../core/rda/stack/Thread";
import JavaClass from "../../../core/cfl/JavaClass";
import {getFieldValue, getString} from "../../../utils/Utils";

export class Document extends JavaObject {

    private static doc: JavaObject = null;

    static getDefault(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        if (this.doc == null) {
            this.doc = thread.runtimeDataArea.createObject("dev.itsu.Document");
        }
        return this.doc;
    }

    static getElementById(thread: Thread, klazz: JavaClass, obj: JavaObject, _id: JavaObject) {
        const elem = thread.runtimeDataArea.createObject("dev.itsu.node.html.HTMLElement");
        (thread.runtimeDataArea.objectHeap[elem.heapIndex] as JavaVariable[]).filter(value => value.name == "id")[0].value = _id;
        return elem;
    }

}