import ClassFile from "./ClassFile.js";
import {
    Constant,
    CONSTANT_CLASS, CONSTANT_DOUBLE,
    CONSTANT_FIELD_REF,
    CONSTANT_FLOAT,
    CONSTANT_INTEGER,
    CONSTANT_INTERFACE_METHOD_REF, CONSTANT_INVOKE_DYNAMIC, CONSTANT_LONG, CONSTANT_METHOD_HANDLE,
    CONSTANT_METHOD_REF, CONSTANT_METHOD_TYPE, CONSTANT_NAME_AND_TYPE,
    CONSTANT_STRING, CONSTANT_UTF8,
    ConstantClassInfo, ConstantDoubleInfo,
    ConstantFieldRefInfo, ConstantFloatInfo,
    ConstantIntegerInfo, ConstantInvokeDynamicInfo, ConstantLongInfo, ConstantMethodHandleInfo,
    ConstantMethodRefInfo, ConstantMethodTypeInfo, ConstantNameAndTypeInfo,
    ConstantPoolInfo,
    ConstantStringInfo, ConstantUtf8Info
} from "../../models/info/ConstantPoolInfo.js";
import {ByteBuffer} from "../../utils/ByteBuffer.js";
import {FieldInfo} from "../../models/info/FieldInfo.js";
import {Attribute, readAttributes} from "../../models/info/AttributeInfo.js";
import {MethodInfo} from "../../models/info/MethodInfo.js";

export const getConstantPoolInfo = (constantPool: ConstantPoolInfo[], index: number): ConstantPoolInfo => {
    return constantPool.filter(constant => constant.id === index)[0];
}

export const parseDescriptor = (descriptor: string): Array<string> => {
    const temp = descriptor.split(")")[0].substring(1);
    // const temp = descriptor.match("(?<=\\()[^\\(\\)]+(?=\\))")?.[0];

    if (temp == null) return [];

    const primitives = ["B", "C", "D", "F", "I", "J", "S", "Z"];
    const args = [];
    const STATE_NORMAL = 0;
    const STATE_OBJECT = 1;
    let state = STATE_NORMAL;
    let isArray = false;
    let objectName = "";

    temp.split("").forEach(char => {
        switch (state) {
            case STATE_NORMAL: {
                if (primitives.includes(char)) {
                    args.push((isArray ? "[" : "") + char);
                    isArray = false;
                }
                else if (char === "L") state = STATE_OBJECT;
                else if (char === "[") isArray = true;
                break;
            }

            case STATE_OBJECT: {
                if (char !== ";") objectName += char;
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
}

export const getArgumentsAndReturnType = (descriptor: string): [Array<string>, string] => {
    const returnTypeSplit = descriptor.split(")");
    return [parseDescriptor(descriptor), returnTypeSplit[returnTypeSplit.length - 1]];
}