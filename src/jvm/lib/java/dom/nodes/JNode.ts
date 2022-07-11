import {JavaObject} from "../../lang/JavaObject.js";
import JChildNode from "./JChildNode.js";
import JDocument from "../JDocument.js";

export default class JNode extends JavaObject {

    protected readonly ref: Node;

    protected constructor(ref: Node) {
        super();
        this.ref = ref;
    }

    static _valueOf(ref: Node): JNode {
        return new JNode(ref);
    }

    getBaseURI(): string {
        return this.ref.baseURI;
    }

    getFirstChild(): JChildNode | null {
        return this.ref.firstChild == null ? null : JNode._valueOf(this.ref.firstChild) as JChildNode;
    }

    isConnected(): boolean {
        return this.ref.isConnected;
    }

    getLastChild(): JChildNode | null {
        return this.ref.lastChild == null ? null : JNode._valueOf(this.ref.lastChild) as JChildNode;
    }

    getNamespaceURI(): string | null {
        return this.ref.namespaceURI;
    }

    getNextSibling(): JChildNode | null {
        return this.ref.nextSibling == null ? null : JNode._valueOf(this.ref.nextSibling) as JChildNode;
    }

    getNodeName(): string {
        return this.ref.nodeName;
    }

    getNodeType(): number {
        return this.ref.nodeType;
    }

    getNodeValue(): string | null {
        return this.ref.nodeValue;
    }

    setNodeValue(value: string | null) {
        this.ref.nodeValue = value;
    }

    getOwnerDocument(): JDocument | null {
        return this.ref.ownerDocument == null ? null : JDocument._valueOf(this.ref.ownerDocument);
    }

}