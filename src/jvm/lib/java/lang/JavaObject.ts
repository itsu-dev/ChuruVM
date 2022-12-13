import Thread from "../../../core/rda/stack/Thread";
import JavaClass from "../../../core/cfl/JavaClass";
import {JavaObject as JObject, JavaVariable} from "../../../../jvm/core/cfl/types"

export class JavaObject {

    static notifyAll(thread: Thread, klass: JavaClass, obj: JObject) {
        // TODO
    }

    static getClass(thread: Thread, klass: JavaClass, obj: JObject) {
        return thread.runtimeDataArea.createClassObject(thread, klass);
    }

    // https://qiita.com/yoshi389111/items/9e34fe297bd908a36065#%E6%89%8B%E5%8B%95%E3%81%A7%E3%83%8F%E3%83%83%E3%82%B7%E3%83%A5%E8%A8%88%E7%AE%97
    static hashCode(thread: Thread, klass: JavaClass, obj: JObject) {
        if (obj == null) return 0;

        const variables = thread.runtimeDataArea.objectHeap[obj.heapIndex] as JavaVariable[];
        let result = 17;

        for (let variable of variables) {
            const value = variable.value;
            result *= 31;
            if (typeof value === "number") {
                result += value;
            } else if (value == null) {
                result += 0;
            } else {
                result += thread.invokeMethod("hashCode", "()I", (value as JObject).type, [], value as JObject);
            }
        }

        return result;
    }

}