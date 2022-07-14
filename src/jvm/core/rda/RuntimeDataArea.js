"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Thread_js_1 = __importDefault(require("./stack/Thread.js"));
var RuntimeDataArea = /** @class */ (function () {
    function RuntimeDataArea() {
        this.threadId = 1;
        this.stackArea = {};
        this.pcRegisters = {};
    }
    RuntimeDataArea.prototype.createThread = function (stackSize) {
        var _this = this;
        this.stackArea[this.threadId] = new Promise(function (resolve) {
            resolve(new Thread_js_1.default(_this, stackSize, _this.threadId));
        });
        this.pcRegisters[this.threadId] = 0;
        this.threadId++;
        return this.stackArea[this.threadId - 1];
    };
    RuntimeDataArea.prototype.getThreadPromise = function (threadId) {
        return this.stackArea[threadId];
    };
    RuntimeDataArea.prototype.setPCRegister = function (threadId, value) {
        this.pcRegisters[threadId] = value;
    };
    RuntimeDataArea.prototype.incrementPCRegister = function (threadId) {
        this.pcRegisters[threadId]++;
    };
    RuntimeDataArea.prototype.getPCRegister = function (threadId) {
        return this.pcRegisters[threadId];
    };
    return RuntimeDataArea;
}());
exports.default = RuntimeDataArea;
//# sourceMappingURL=RuntimeDataArea.js.map