import {JavaObject, JavaVariable} from "../../../../core/cfl/types";
import Thread from "../../../../core/rda/stack/Thread";
import JavaClass from "../../../../core/cfl/JavaClass";
import {getFieldValue, getString} from "../../../../utils/Utils";

export class EventTarget extends JavaObject {

    static addEventListener(thread: Thread, klazz: JavaClass, obj: JavaObject, _type: JavaObject, _callback: JavaObject) {
        const type = getString(thread.runtimeDataArea, _type);
        document.getElementById(getString(thread.runtimeDataArea, getFieldValue(obj, "id"))).addEventListener(type, () => thread.invokeMethod("accept", "(Ljava/lang/Object;)V", _callback.type, [null], _callback))
    }

}