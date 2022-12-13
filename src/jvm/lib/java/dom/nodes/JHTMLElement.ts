import JElement from "./JElement.js";

export default class JHTMLElement extends JElement {

    private constructor(ref: HTMLElement) {
        super(ref);
    }

    static _valueOf(ref: HTMLElement) {
        return new JHTMLElement(ref);
    }

    _get(): HTMLElement {
        return this.ref as HTMLElement;
    }

    getAccessKey(): string {
        this._get().innerHTML
        return this._get().accessKey;
    }

    setAccessKey(accessKey: string) {
        this._get().accessKey = accessKey;
    }

    getAccessKeyLabel(): string {
        return this._get().accessKeyLabel;
    }

    getAutoCapitalize(): string {
        return this._get().autocapitalize;
    }

    setAutoCapitalize(autoCapitalize: string) {
        this._get().autocapitalize = autoCapitalize;
    }

    getDir(): string {
        return this._get().dir;
    }

    setDir(dir: string) {
        this._get().dir = dir;
    }

    isDraggable(): boolean {
        return this._get().draggable;
    }

    setDraggable(draggable: boolean) {
        this._get().draggable = draggable;
    }

    isHidden(): boolean {
        return this._get().hidden;
    }

    setHidden(hidden: boolean) {
        this._get().hidden = hidden;
    }

    getInnerText(): string {
        return this._get().innerText;
    }

    addInnerText(innerText: string) {
        this._get().innerText += innerText;
    }

    setInnerText(innerText: string) {
        this._get().innerText = innerText;
    }

    getLang(): string {
        return this._get().lang;
    }

    setLang(lang: string) {
        this._get().lang = lang;
    }

    getOffsetHeight(): number {
        return this._get().offsetHeight;
    }

    getOffsetLeft(): number {
        return this._get().offsetLeft;
    }

    getOffsetParent(): JElement | null {
        return this._get().offsetParent == null ? null : JElement._valueOf(this._get().offsetParent);
    }

    getOffsetTop(): number {
        return this._get().offsetTop;
    }

    getOffsetWidth(): number {
        return this._get().offsetWidth
    }

    getSpellCheck(): boolean {
        return this._get().spellcheck;
    }

    setSpellCheck(spellCheck: boolean) {
        this._get().spellcheck = spellCheck;
    }

    getTitle(): string {
        return this._get().title;
    }

    setTitle(title: string) {
        this._get().title = title;
    }

    getTranslate(): boolean {
        return this._get().translate;
    }

    setTranslate(translate: boolean) {
        this._get().translate = translate;
    }

    click() {
        this._get().click();
    }

}