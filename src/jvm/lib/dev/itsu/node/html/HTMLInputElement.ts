import {JavaObject, JavaVariable} from "../../../../../core/cfl/types";
import Thread from "../../../../../core/rda/stack/Thread";
import JavaClass from "../../../../../core/cfl/JavaClass";
import {getFieldValue, getString} from "../../../../../utils/Utils";
import {Element} from "../Element";
import {HTMLElement} from "./HTMLElement";

export class HTMLInputElement extends HTMLElement {

    static getValue(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        return obj.runtimeDataArea.createStringObject(thread, (document.getElementById(getString(thread.runtimeDataArea, getFieldValue(obj, "id"))) as any).value);
    }

    static setValue(thread: Thread, klazz: JavaClass, obj: JavaObject, _value: JavaObject) {
        (document.getElementById(getString(thread.runtimeDataArea, getFieldValue(obj, "id"))) as any).value = getString(obj.runtimeDataArea, _value);
    }

}