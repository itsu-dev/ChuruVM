import JNode from "./nodes/JNode.js";
import JHTMLElement from "./nodes/JHTMLElement.js";
import JNodeListOf from "./collection/JNodeListOf.js";

export default class JDocument extends JNode {

    private constructor(ref: Document) {
        super(ref);
    }

    private static defaultRef = JDocument._valueOf(document);

    static _valueOf(ref: Document) {
        return new JDocument(ref);
    }

    static getDefault(): JDocument {
        return this.defaultRef;
    }

    private _get(): Document {
        return this.ref as Document;
    }

    getElementById(elementId: string): JHTMLElement | null {
        let element = this._get().getElementById(elementId);
        return element == null ? null : JHTMLElement._valueOf(element);
    }

    getElementByName(elementName: string): JNodeListOf<JHTMLElement> | null {
        let elements = this._get().getElementsByName(elementName);
        return elements == null ? null : JNodeListOf._valueOf(elements);
    }

}