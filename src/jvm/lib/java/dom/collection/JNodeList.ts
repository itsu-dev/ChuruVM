import {JavaObject} from "../../lang/JavaObject.js";
import JNode from "../nodes/JNode.js";

export default abstract class JNodeList extends JavaObject {

    protected constructor() {
        super();
    }

    abstract getLength(): number;

    abstract getItem(index: number): JNode | null;

}