import Thread from "../core/rda/stack/Thread";
import {Opcode} from "../core/rda/stack/Frame";
import JavaClass from "../core/cfl/JavaClass";
import {MethodInfo} from "../models/info/MethodInfo";
import {
    CONSTANT_STRING,
    ConstantClassInfo,
    ConstantFieldRefInfo, ConstantMethodRefInfo,
    ConstantNameAndTypeInfo, ConstantStringInfo,
    readUtf8FromConstantPool
} from "../models/info/ConstantPoolInfo";
import {CodeAttribute} from "../models/info/AttributeInfo";
import {FieldInfo} from "../models/info/FieldInfo";
import {getConstantPoolInfo} from "../core/BootstrapClassLoader";
import {Expr} from "./types";
import {getArgumentsAndReturnType} from "../core/cfl/ClassFileLoader";

export class JITCompiler {

    static aliases = {
        "java.lang.System.out.println": "console.log"
    }

    static compile(thread: Thread, clazz: JavaClass, method: MethodInfo) {
        let result = "";
        let stack = [];

        const codeAttributes =
            method.attributes.filter(attribute => readUtf8FromConstantPool(clazz.constantPool, attribute.attributeNameIndex) === "Code");
        if (!codeAttributes || codeAttributes.length == 0) return;

        const codeAttribute = codeAttributes[0]!! as CodeAttribute;
        const codes = codeAttribute.code;
        codes.resetOffset();

        let code = 0;
        for (let i = 0; codes.offset < codes.getLength(); i++) {
            code = codes.getUint8();

            switch (code) {
                // ldc
                case 0x12: {
                    const info = getConstantPoolInfo(clazz.constantPool, codes.getUint8()).info;
                    if (info.tag === CONSTANT_STRING) {
                        stack.push({
                            expr: `"${readUtf8FromConstantPool(clazz.constantPool, (info as ConstantStringInfo).stringIndex)}"`
                        });
                        break;
                    }
                    break;
                }

                // return
                case 0xb1: {
                    result += "return;\n";
                    break;
                }

                // getstatic
                case 0xb2: {
                    const fieldRef = getConstantPoolInfo(clazz.constantPool, (codes.getUint8() << 8) | codes.getUint8()).info as ConstantFieldRefInfo;
                    const classRef = getConstantPoolInfo(clazz.constantPool, fieldRef.classIndex).info as ConstantClassInfo;
                    const fieldNameAndTypeRef = getConstantPoolInfo(clazz.constantPool, fieldRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo;
                    const className = readUtf8FromConstantPool(clazz.constantPool, classRef.nameIndex).split("/").join(".");
                    const fieldName = readUtf8FromConstantPool(clazz.constantPool, fieldNameAndTypeRef.nameIndex);
                    stack.push({
                        expr: className + "." + fieldName
                    });
                    break;
                }

                // invokevirtual
                case 0xb6: {
                    const methodRef = getConstantPoolInfo(clazz.constantPool, (codes.getUint8() << 8) | codes.getUint8()).info as ConstantMethodRefInfo;
                    const methodNameAndTypeRef = getConstantPoolInfo(clazz.constantPool, methodRef.nameAndTypeIndex).info as ConstantNameAndTypeInfo;
                    const klazz = getConstantPoolInfo(clazz.constantPool, methodRef.classIndex).info as ConstantClassInfo;
                    const className = readUtf8FromConstantPool(clazz.constantPool, klazz.nameIndex).split("/").join(".");
                    const descriptor = readUtf8FromConstantPool(clazz.constantPool, methodNameAndTypeRef.descriptorIndex);
                    const invokeMethodName = readUtf8FromConstantPool(clazz.constantPool, methodNameAndTypeRef.nameIndex);
                    const argumentsAndReturnType = getArgumentsAndReturnType(descriptor);

                    let args = "";
                    for (let j = 0; j < argumentsAndReturnType[0].length; j++) {
                        args += ", " + stack.pop().expr;
                    }

                    let name = stack.pop().expr + "." + invokeMethodName;
                    if (this.aliases[name] != null) name = this.aliases[name];

                    result += `${name}(${args.substring(2)});\n`;

                    break;
                }
            }
        }

        const argumentsAndReturnType = getArgumentsAndReturnType(readUtf8FromConstantPool(clazz.constantPool, method.descriptorIndex));
        const invokeMethodName = readUtf8FromConstantPool(clazz.constantPool, method.nameIndex);
        let args = "";

        for (let i = 0; i < argumentsAndReturnType[0].length; i++) {
            args += `, _arg${i}`;
        }

        return `function ${clazz.name.split(".").join("_")}_${invokeMethodName}(${args.substring(2)}) {\n${result}}`;
    }

}
