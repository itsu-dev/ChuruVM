"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var JavaObject_js_1 = require("../lang/JavaObject.js");
var IllegalStateException_js_1 = require("../lang/IllegalStateException.js");
var jvm_js_1 = require("../../../jvm.js");
var URLConnection = /** @class */ (function (_super) {
    __extends(URLConnection, _super);
    function URLConnection(url) {
        var _this = _super.call(this) || this;
        _this.allowUserInteraction = false;
        _this.connected = false;
        _this.doInput = true;
        _this.doOutput = false;
        _this.url = undefined;
        _this.ifModifiedSince = undefined;
        _this.useCaches = false;
        _this.requestProperties = {};
        // TODO delete
        _this.inputStream = undefined;
        _this.url = url;
        return _this;
    }
    URLConnection.prototype.getInputStream = function () {
        return this.inputStream;
    };
    URLConnection.prototype.getURL = function () {
        return this.url;
    };
    URLConnection.prototype.setDoInput = function (doInput) {
        if (this.connected)
            (0, jvm_js_1.throwErrorOrException)(new IllegalStateException_js_1.IllegalStateException());
        this.doInput = doInput;
    };
    URLConnection.prototype.setDoOutput = function (doOutput) {
        if (this.connected)
            (0, jvm_js_1.throwErrorOrException)(new IllegalStateException_js_1.IllegalStateException());
        this.doOutput = doOutput;
    };
    URLConnection.prototype.setRequestProperty = function (key, value) {
        if (this.connected)
            (0, jvm_js_1.throwErrorOrException)(new IllegalStateException_js_1.IllegalStateException());
        this.requestProperties[key] = value;
    };
    URLConnection.prototype.addRequestProperty = function (key, value) {
        if (this.connected)
            (0, jvm_js_1.throwErrorOrException)(new IllegalStateException_js_1.IllegalStateException());
        this.requestProperties[key] = value;
    };
    URLConnection.prototype.getRequestProperty = function (key) {
        if (this.connected)
            (0, jvm_js_1.throwErrorOrException)(new IllegalStateException_js_1.IllegalStateException());
        return this.requestProperties[key];
    };
    return URLConnection;
}(JavaObject_js_1.JavaObject));
exports.default = URLConnection;
//# sourceMappingURL=URLConnection.js.map