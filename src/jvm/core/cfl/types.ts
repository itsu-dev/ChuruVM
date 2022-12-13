import RuntimeDataArea from "../rda/RuntimeDataArea";
import JavaClass, {Field} from "./JavaClass";
import BootstrapClassLoader from "../BootstrapClassLoader";
import Thread from "../rda/stack/Thread";

export class JavaVariable {

    value: number | boolean | string | JavaObject | null;
    readonly typeName: string;
    readonly name: string;

    constructor(typeName: string, value: number | boolean | string | any | null, name: string = null) {
        this.typeName = typeName;
        this.name = name;
        this.value = value;
    }

}

export class JavaObject {
    readonly type: JavaClass;
    readonly heapIndex: number;
    readonly isArray: boolean;
    private initialized: boolean = false;
    runtimeDataArea: RuntimeDataArea;

    constructor(type: JavaClass, heapIndex: number, isArray: boolean = false) {
        this.type = type;
        this.heapIndex = heapIndex;
        this.isArray = isArray;
    }

    init(runtimeDataArea: RuntimeDataArea) {
        if (this.initialized) return;

        this.runtimeDataArea = runtimeDataArea;

        const variables = runtimeDataArea.objectHeap[this.heapIndex] as Array<JavaVariable>;
        const fields = this.type.getFields();

        let field: Field;
        for (let i = 0; i < variables.length; i++) {
            field = fields[i];
            if (field.typeName === "java.lang.Boolean") {
                variables[i] = new JavaVariable(field.typeName, false, field.name);
            } else if (field.typeName === "B") {
                variables[i] = new JavaVariable(field.typeName, false, field.name);
            } else if (JavaClass.isPrimitive(field.typeName)) {
                variables[i] = new JavaVariable(field.typeName, 0, field.name);
            } else if (JavaClass.isWrappedPrimitive(field.typeName)) {
                variables[i] = new JavaVariable(field.typeName, 0, field.name);
            } else {
                variables[i] = new JavaVariable(field.typeName, null, field.name);
            }
        }

        this.initialized = true;
    }

}