import {JavaObject} from "../../../../core/cfl/types";
import Thread from "../../../../core/rda/stack/Thread";
import JavaClass from "../../../../core/cfl/JavaClass";
import {getFieldValue, getString} from "../../../../utils/Utils";
import {Node} from "./Node";

export class Element extends Node {

    static insertAdjacentHTML(thread: Thread, klazz: JavaClass, obj: JavaObject, _position: JavaObject, _text: JavaObject) {
        document.getElementById(getString(thread.runtimeDataArea, getFieldValue(obj, "id"))).insertAdjacentHTML(getString(obj.runtimeDataArea, _position) as InsertPosition, getString(obj.runtimeDataArea, _text));
    }

    static remove(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        document.getElementById(getString(thread.runtimeDataArea, getFieldValue(obj, "id"))).remove();
    }

}