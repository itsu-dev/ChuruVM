import {JavaObject as Object} from '../lang/JavaObject';
import Thread from "../../../core/rda/stack/Thread";
import JavaClass from "../../../core/cfl/JavaClass";
import {JavaObject} from "../../../core/cfl/types";

export class Runtime extends Object {

    static availableProcessors(thread: Thread, klass: JavaClass, obj: JavaObject) {
        return window.navigator.hardwareConcurrency;
    }

}