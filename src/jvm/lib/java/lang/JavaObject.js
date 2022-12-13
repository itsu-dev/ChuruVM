"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaObject = void 0;
var JavaObject = /** @class */ (function () {
    function JavaObject() {
    }
    JavaObject.notifyAll = function (thread, klass, obj) {
        // TODO
    };
    JavaObject.getClass = function (thread, klass, obj) {
        return thread.runtimeDataArea.createClassObject(thread, klass);
    };
    // https://qiita.com/yoshi389111/items/9e34fe297bd908a36065#%E6%89%8B%E5%8B%95%E3%81%A7%E3%83%8F%E3%83%83%E3%82%B7%E3%83%A5%E8%A8%88%E7%AE%97
    JavaObject.hashCode = function (thread, klass, obj) {
        if (obj == null)
            return 0;
        var variables = thread.runtimeDataArea.objectHeap[obj.heapIndex];
        var result = 17;
        for (var _i = 0, variables_1 = variables; _i < variables_1.length; _i++) {
            var variable = variables_1[_i];
            var value = variable.value;
            result *= 31;
            if (typeof value === "number") {
                result += value;
            }
            else if (value == null) {
                result += 0;
            }
            else {
                result += thread.invokeMethod("hashCode", "()I", value.type, [], value);
            }
        }
        return result;
    };
    return JavaObject;
}());
exports.JavaObject = JavaObject;
//# sourceMappingURL=JavaObject.js.map