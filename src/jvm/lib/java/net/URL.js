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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var JavaObject_js_1 = require("../lang/JavaObject.js");
var URLStreamHandler_js_1 = __importDefault(require("./URLStreamHandler.js"));
var HttpURLConnection_js_1 = __importDefault(require("./HttpURLConnection.js"));
var URL = /** @class */ (function (_super) {
    __extends(URL, _super);
    function URL(spec) {
        var _this = _super.call(this) || this;
        _this.spec = spec;
        _this.protocol = spec.split("://")[0];
        _this.urlStreamHandlerFactory = new /** @class */ (function () {
            function class_1() {
            }
            class_1.prototype.createURLStreamHandler = function (protocol) {
                switch (protocol) {
                    case "https":
                    case "http": {
                        return new /** @class */ (function (_super) {
                            __extends(class_2, _super);
                            function class_2() {
                                return _super !== null && _super.apply(this, arguments) || this;
                            }
                            class_2.prototype.openConnection = function (u) {
                                return new HttpURLConnection_js_1.default(u);
                            };
                            return class_2;
                        }(URLStreamHandler_js_1.default));
                    }
                    default: {
                        return undefined;
                    }
                }
            };
            return class_1;
        }());
        return _this;
    }
    URL.prototype.openConnection = function () {
        return this.urlStreamHandlerFactory.createURLStreamHandler(this.protocol).openConnection(this);
    };
    URL.prototype.setURLStreamHandlerFactory = function (fac) {
        this.urlStreamHandlerFactory = fac;
    };
    URL.prototype.toString = function () {
        return this.spec;
    };
    return URL;
}(JavaObject_js_1.JavaObject));
exports.default = URL;
//# sourceMappingURL=URL.js.map