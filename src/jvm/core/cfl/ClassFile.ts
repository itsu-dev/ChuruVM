import {ConstantPoolInfo} from "../../models/info/ConstantPoolInfo.js";
import {Attribute} from "../../models/info/AttributeInfo.js";
import {FieldInfo} from "../../models/info/FieldInfo.js";
import {MethodInfo} from "../../models/info/MethodInfo.js";

export default class ClassFile {
    constantPoolCount: number
    constantPool: ConstantPoolInfo[]
    accessFlags: number
    thisClassIndex: number
    superClassIndex: number
    interfacesCount: number
    interfaces: number[]
    fieldsCount: number
    fieldInfos: FieldInfo[]
    methodsCount: number
    methodInfos: MethodInfo[]
    attributesCount: number
    attributes: Attribute[]
}