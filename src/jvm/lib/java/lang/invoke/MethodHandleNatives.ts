import {JavaObject as Object} from "../JavaObject";
import {Thread} from "../Thread";
import JavaClass from "../../../../core/cfl/JavaClass";
import {JavaObject} from "../../../../core/cfl/types";

export class MethodHandleNatives extends Object {

    static registerNatives(thread: Thread, klazz: JavaClass, obj: JavaObject) {
        return;
    }

    static resolve(thread: Thread, klazz: JavaClass, obj: JavaObject, _self: JavaObject, _caller: JavaObject) {
        return _self;
    }

    static getConstant(thread: Thread, klazz: JavaClass, obj: JavaObject, _which: number) {
        // TODO
        return 1;
    }

}