"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldValue = exports.getString = exports.hashString = exports.cyrb53 = void 0;
var cyrb53 = function (str, seed) {
    if (seed === void 0) { seed = 0; }
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (var i = 0, ch = void 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
exports.cyrb53 = cyrb53;
var hashString = function (str) {
    var array = Array.from(new TextEncoder().encode(str));
    var hashCode = 0;
    var limit = array.length;
    for (var i = 0; i < limit; i++) {
        hashCode = hashCode * 31 + array[i];
    }
    return hashCode;
};
exports.hashString = hashString;
var getString = function (runtimeDataArea, obj) {
    return new TextDecoder("UTF-8").decode(Uint8Array.from(runtimeDataArea.objectHeap[runtimeDataArea.objectHeap[obj.heapIndex].filter(function (v) { return v.name === "value"; })[0].value.heapIndex]).buffer);
};
exports.getString = getString;
var getFieldValue = function (obj, name) {
    return obj.runtimeDataArea.objectHeap[obj.heapIndex].filter(function (v) { return v.name === name; })[0].value;
};
exports.getFieldValue = getFieldValue;
//# sourceMappingURL=Utils.js.map