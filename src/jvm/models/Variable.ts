export interface Variable {
    setValue(value: any);
    getValue();
    getCategory();
}

export class IntVariable implements Variable {

    value: number;

    constructor(value: number) {
        this.value = value;
    }

    setValue(value: number) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getCategory() {
        return 1;
    }

}

export class LongVariable implements Variable {

    value: number;

    constructor(value: number) {
        this.value = value;
    }

    setValue(value: number) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getCategory() {
        return 2;
    }

}

export class FloatVariable implements Variable {

    value: number;

    constructor(value: number) {
        this.value = value;
    }

    setValue(value: number) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getCategory() {
        return 1;
    }

}

export class DoubleVariable implements Variable {

    value: number;

    constructor(value: number) {
        this.value = value;
    }

    setValue(value: number) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getCategory() {
        return 2;
    }

}

export class AnyVariable implements Variable {

    value: any;

    constructor(value: string) {
        this.value = value;
    }

    setValue(value: string) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getCategory() {
        return 0;
    }

}

export class PrimitiveArrayVariable implements Variable {

    type: number;
    value: Array<any>;

    constructor(type: number, value: Array<any>) {
        this.type = type;
        this.value = value;
    }

    setValue(value: Array<any>) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getCategory() {
        return 0;
    }

}