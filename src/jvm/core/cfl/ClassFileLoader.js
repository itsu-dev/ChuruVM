"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgumentsAndReturnType = exports.parseDescriptor = exports.getConstantPoolInfo = void 0;
var getConstantPoolInfo = function (constantPool, index) {
    return constantPool.filter(function (constant) { return constant.id === index; })[0];
};
exports.getConstantPoolInfo = getConstantPoolInfo;
var parseDescriptor = function (descriptor) {
    var temp = descriptor.split(")")[0].substring(1);
    // const temp = descriptor.match("(?<=\\()[^\\(\\)]+(?=\\))")?.[0];
    if (temp == null)
        return [];
    var primitives = ["B", "C", "D", "F", "I", "J", "S", "Z"];
    var args = [];
    var STATE_NORMAL = 0;
    var STATE_OBJECT = 1;
    var state = STATE_NORMAL;
    var isArray = false;
    var objectName = "";
    temp.split("").forEach(function (char) {
        switch (state) {
            case STATE_NORMAL: {
                if (primitives.includes(char)) {
                    args.push((isArray ? "[" : "") + char);
                    isArray = false;
                }
                else if (char === "L")
                    state = STATE_OBJECT;
                else if (char === "[")
                    isArray = true;
                break;
            }
            case STATE_OBJECT: {
                if (char !== ";")
                    objectName += char;
                else {
                    args.push((isArray ? "[" : "") + objectName);
                    isArray = false;
                    objectName = "";
                    state = STATE_NORMAL;
                }
                break;
            }
        }
    });
    return args;
};
exports.parseDescriptor = parseDescriptor;
var getArgumentsAndReturnType = function (descriptor) {
    var returnTypeSplit = descriptor.split(")");
    return [(0, exports.parseDescriptor)(descriptor), returnTypeSplit[returnTypeSplit.length - 1]];
};
exports.getArgumentsAndReturnType = getArgumentsAndReturnType;
//# sourceMappingURL=ClassFileLoader.js.map