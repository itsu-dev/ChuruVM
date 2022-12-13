import {JavaObject, JavaVariable} from "../../../../../core/cfl/types";
import Thread from "../../../../../core/rda/stack/Thread";
import JavaClass from "../../../../../core/cfl/JavaClass";
import {getFieldValue, getString} from "../../../../../utils/Utils";
import {Element} from "../Element";

export class HTMLElement extends Element {

    static getInnerText(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        return obj.runtimeDataArea.createStringObject(thread, document.getElementById(getString(thread.runtimeDataArea, getFieldValue(obj, "id"))).innerText);
    }

    static setInnerText(thread: Thread, klazz: JavaClass, obj: JavaObject, _innerText: JavaObject) {
        document.getElementById(getString(thread.runtimeDataArea, getFieldValue(obj, "id"))).innerText = getString(obj.runtimeDataArea, _innerText);
    }

    static getValue(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        return obj.runtimeDataArea.createStringObject(thread, (document.getElementById(getString(thread.runtimeDataArea, getFieldValue(obj, "id"))) as any).value);
    }

    static setValue(thread: Thread, klazz: JavaClass, obj: JavaObject, _value: JavaObject) {
        (document.getElementById(getString(thread.runtimeDataArea, getFieldValue(obj, "id"))) as any).value = getString(obj.runtimeDataArea, _value);
    }

}