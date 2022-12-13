/*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    A fast and simple hash function with decent collision resistance.
    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
    Public domain. Attribution appreciated.
*/
import {JavaObject, JavaVariable} from "../core/cfl/types";
import RuntimeDataArea from "../core/rda/RuntimeDataArea";

export const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

export const hashString = (str: string): number => {
    const array = Array.from(new TextEncoder().encode(str))
    let hashCode = 0;
    const limit = array.length;
    for (let i = 0; i < limit; i++) {
        hashCode = hashCode * 31 + array[i];
    }
    return hashCode;
}

export const getString = (runtimeDataArea: RuntimeDataArea, obj: JavaObject) => {
    return new TextDecoder("UTF-8").decode(Uint8Array.from((runtimeDataArea.objectHeap[((runtimeDataArea.objectHeap[obj.heapIndex] as JavaVariable[]).filter(v => v.name === "value")[0].value as JavaObject).heapIndex] as Array<number>)).buffer)
}

export const getFieldValue = (obj: JavaObject, name: string) => {
    return (obj.runtimeDataArea.objectHeap[obj.heapIndex] as JavaVariable[]).filter(v => v.name === name)[0].value as JavaObject;
}