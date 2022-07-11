import JNode from "./JNode.js";

export default class JChildNode extends JNode {

    private constructor(ref: ChildNode) {
        super(ref);
    }

    static _valueOf(ref: ChildNode | null) {
        return new JChildNode(ref);
    }

}