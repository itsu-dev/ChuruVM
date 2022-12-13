"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaObject = exports.JavaVariable = void 0;
var JavaClass_1 = __importDefault(require("./JavaClass"));
var JavaVariable = /** @class */ (function () {
    function JavaVariable(typeName, value, name) {
        if (name === void 0) { name = null; }
        this.typeName = typeName;
        this.name = name;
        this.value = value;
    }
    return JavaVariable;
}());
exports.JavaVariable = JavaVariable;
var JavaObject = /** @class */ (function () {
    function JavaObject(type, heapIndex, isArray) {
        if (isArray === void 0) { isArray = false; }
        this.initialized = false;
        this.type = type;
        this.heapIndex = heapIndex;
        this.isArray = isArray;
    }
    JavaObject.prototype.init = function (runtimeDataArea) {
        if (this.initialized)
            return;
        this.runtimeDataArea = runtimeDataArea;
        var variables = runtimeDataArea.objectHeap[this.heapIndex];
        var fields = this.type.getFields();
        var field;
        for (var i = 0; i < variables.length; i++) {
            field = fields[i];
            if (field.typeName === "java.lang.Boolean") {
                variables[i] = new JavaVariable(field.typeName, false, field.name);
            }
            else if (field.typeName === "B") {
                variables[i] = new JavaVariable(field.typeName, false, field.name);
            }
            else if (JavaClass_1.default.isPrimitive(field.typeName)) {
                variables[i] = new JavaVariable(field.typeName, 0, field.name);
            }
            else if (JavaClass_1.default.isWrappedPrimitive(field.typeName)) {
                variables[i] = new JavaVariable(field.typeName, 0, field.name);
            }
            else {
                variables[i] = new JavaVariable(field.typeName, null, field.name);
            }
        }
        this.initialized = true;
    };
    return JavaObject;
}());
exports.JavaObject = JavaObject;
//# sourceMappingURL=types.js.map