import JNodeList from "./JNodeList.js";
import {JavaObject} from "../../lang/JavaObject.js";
import JNode from "../nodes/JNode.js";

export default class JNodeListOf<T extends JNode> extends JNodeList {

    private readonly ref: NodeListOf<Node>;

    private constructor(ref: NodeListOf<Node>) {
        super();
        this.ref = ref;
    }

    static _valueOf(ref: NodeListOf<Node>) {
        return new JNodeListOf(ref);
    }

    forEach(callbackFunc: (value: JNode, key: number, parent: JNodeListOf<T>) => void, args?: JavaObject): void {
        this.ref.forEach(((value, key, parent) => callbackFunc(JNode._valueOf(value), key, JNodeListOf._valueOf(parent))));
    }

    getLength(): number {
        return this.ref.length;
    }

    getItem(index: number): JNode | null {
        return JNode._valueOf(this.ref.item(index));
    }

}