import JNode from "./JNode.js";
import JDocument from "../JDocument.js";
import {JavaObject} from "../../lang/JavaObject.js";
import JInnerHTML from "./interfaces/JInnerHTML.js";

export default class JElement extends JNode implements JInnerHTML {

    protected constructor(ref: Element) {
        super(ref);
    }

    static _valueOf(ref: Element) {
        return new JElement(ref);
    }

    _get(): Element {
        return this.ref as Element;
    }

    addInnerHTML(innerHTML: string) {
        this._get().innerHTML += innerHTML;
    }

    setInnerHTML(innerHTML: string) {
        this._get().innerHTML = innerHTML;
    }

    getInnerHTML(): string {
        return this._get().innerHTML;
    }

    getClassName(): string {
        return this._get().className;
    }

    setClassName(className: string) {
        this._get().className = className;
    }

    getClientHeight(): number {
        return this._get().clientHeight;
    }

    getClientLeft(): number {
        return this._get().clientLeft;
    }

    getClientTop(): number {
        return this._get().clientTop;
    }

    getClientWidth(): number {
        return this._get().clientWidth;
    }

    getId(): string {
        return this._get().id;
    }

    getLocalName(): string {
        return this._get().localName;
    }

    getNamespaceURI(): string {
        return this._get().namespaceURI;
    }

    getOwnerDocument(): JDocument | null {
        return this._get().ownerDocument == null ? null : JDocument._valueOf(this._get().ownerDocument);
    }

    getPrefix(): string | null {
        return this._get().prefix == null ? null : this._get().prefix;
    }

    getScrollHeight(): number {
        return this._get().scrollHeight;
    }

    getScrollLeft(): number {
        return this._get().scrollLeft;
    }

    setScrollLeft(scrollLeft: number) {
        this._get().scrollLeft = scrollLeft;
    }

    getScrollTop(): number {
        return this._get().scrollTop;
    }

    setScrollTop(scrollTop: number) {
        this._get().scrollTop = scrollTop;
    }

    getScrollWidth(): number {
        return this._get().scrollWidth;
    }

    getSlot(): string {
        return this._get().slot;
    }

    setSlot(slot: string) {
        this._get().slot = slot;
    }

    getAttribute(qualifiedName: string): string | null {
        return this._get().getAttribute(qualifiedName);
    }

    getAttributeNS(namespace: string | null, localName: string): string | null {
        return this._get().getAttributeNS(namespace, localName);
    }

    getAttributeNames(): string[] {
        return this._get().getAttributeNames();
    }

    hasAttribute(qualifiedName: string): boolean {
        return this._get().hasAttribute(qualifiedName);
    }

    hasAttributeNS(namespace: string | null, localName: string): boolean {
        return this._get().hasAttributeNS(namespace, localName);
    }

    hasPointerCapture(pointerId: number): boolean {
        return this._get().hasPointerCapture(pointerId);
    }

    matches(selectors: string): boolean {
        return this._get().matches(selectors);
    }

    msGetRegionContent(): any {
        // TODO return this._get().msGetRegionContent();
    }

    releasePointerCapture(pointerId: number) {
        this._get().releasePointerCapture(pointerId);
    }

    removeAttribute(qualifiedName: string) {
        this._get().removeAttribute(qualifiedName);
    }

    removeAttributeNS(namespace: string | null, localName: string) {
        this._get().removeAttributeNS(namespace, localName);
    }

    setAttribute(qualifiedName: string, value: string) {
        this._get().setAttribute(qualifiedName, value);
    }

    setAttributeNS(namespace: string | null, qualifiedName: string, value: string) {
        this._get().setAttributeNS(namespace, qualifiedName, value);
    }

    setPointerCapture(pointerId: number) {
        this.setPointerCapture(pointerId);
    }

    toggleAttribute(qualifiedName: string, force?: boolean): boolean {
        return this._get().toggleAttribute(qualifiedName, force);
    }

    webkitMatchesSelector(selectors: string): boolean {
        return this._get().webkitMatchesSelector(selectors);
    }

}