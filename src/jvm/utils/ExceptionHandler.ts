import RuntimeDataArea from "../core/rda/RuntimeDataArea";
import {readUtf8FromConstantPool} from "../models/info/ConstantPoolInfo";
import {CodeAttribute, LineNumberTableAttribute} from "../models/info/AttributeInfo";
import {OutputLogger} from "./OutputLogger";
import {JavaObject, JavaVariable} from "../core/cfl/types";

export const throwException = (name: string, runtimeDataArea: RuntimeDataArea) => {
    console.error(name);
    // (document.getElementById("out") as HTMLDivElement).innerHTML += `<span style='color: red;'>${name}<br /></span>`;
    OutputLogger.error(name);

    let count = 0;
    runtimeDataArea.getCurrentThread().stack.reverse().forEach((frame, index) => {
        if (19 < count) {
            OutputLogger.error(`&nbsp;&nbsp;&nbsp;&nbsp;...${runtimeDataArea.getCurrentThread().stack.length - index + 1} more`)
            console.error(`    ...${runtimeDataArea.getCurrentThread().stack.length - index + 1} more`);
            return;
        }

        const codeAttribute = frame.method.attributes.filter(value => readUtf8FromConstantPool(frame.constantPool, value.attributeNameIndex) === "Code")[0] as CodeAttribute;
        const lineNumberAttribute = codeAttribute.attributes.filter(value => readUtf8FromConstantPool(frame.constantPool, value.attributeNameIndex) === "LineNumberTable")[0] as LineNumberTableAttribute;

        let lineNumberTable = null;
        if (!(frame.opcode == null)) {
            lineNumberTable = lineNumberAttribute.lineNumberTable.filter((value, index, array) => {
                if (index + 1 < array.length) {
                    return value.startPc <= frame.opcode.id && frame.opcode.id < array[index + 1].startPc
                } else {
                    return value.startPc <= frame.opcode.id;
                }
            })[0];
        }

        const text = lineNumberTable == null ? `${frame.javaClass.getSimpleName()}.java:Unknown Source` : `${frame.javaClass.getSimpleName()}.java:${lineNumberTable.lineNumber}`;

        // (document.getElementById("out") as HTMLDivElement).innerHTML += `<span style='color: red;'>&nbsp;&nbsp;&nbsp;&nbsp;at ${frame.javaClass.name}.${readUtf8FromConstantPool(frame.constantPool, frame.method.nameIndex)}(${text})<br /></span>`;
        OutputLogger.error(`&nbsp;&nbsp;&nbsp;&nbsp;at ${frame.javaClass.name}.${readUtf8FromConstantPool(frame.constantPool, frame.method.nameIndex)}(${text})`)
        console.error(`    at ${frame.javaClass.name}.${readUtf8FromConstantPool(frame.constantPool, frame.method.nameIndex)}(${text})`);

        count++;
    });


    throw new Error(name);
}