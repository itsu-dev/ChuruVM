import {JavaObject} from "../../../core/cfl/types";
import Thread from "../../../core/rda/stack/Thread";
import JavaClass from "../../../core/cfl/JavaClass";
import {getString} from "../../../utils/Utils";


export class $ extends JavaObject {

    static alert(thread: Thread, klazz: JavaClass, obj: JavaObject, _text: JavaObject) {
        alert(getString(thread.runtimeDataArea, _text));
    }

}