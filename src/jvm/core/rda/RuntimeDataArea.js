"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Thread_js_1 = __importDefault(require("./stack/Thread.js"));
var JavaClass_1 = __importDefault(require("../cfl/JavaClass"));
var types_1 = require("../cfl/types");
var BootstrapClassLoader_1 = __importDefault(require("../BootstrapClassLoader"));
var Utils_1 = require("../../utils/Utils");
var RuntimeDataArea = /** @class */ (function () {
    function RuntimeDataArea() {
        this.threadId = 1;
        this.stackArea = {};
        this.pcRegisters = {};
        this.classHeap = {};
        this.objectHeap = [];
        this.loadedJars = [];
        this.loadedClasses = {};
        this.nativeModules = {};
    }
    RuntimeDataArea.prototype.registerNatives = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
            return __generator(this, function (_14) {
                switch (_14.label) {
                    case 0:
                        _a = this.nativeModules;
                        _b = "dev.itsu.Document";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/dev/itsu/Document.js")); })];
                    case 1:
                        _a[_b] = _14.sent();
                        _c = this.nativeModules;
                        _d = "dev.itsu.$";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/dev/itsu/$.js")); })];
                    case 2:
                        _c[_d] = _14.sent();
                        _e = this.nativeModules;
                        _f = "dev.itsu.node.Element";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/dev/itsu/node/Element.js")); })];
                    case 3:
                        _e[_f] = _14.sent();
                        _g = this.nativeModules;
                        _h = "dev.itsu.node.html.HTMLElement";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/dev/itsu/node/html/HTMLElement.js")); })];
                    case 4:
                        _g[_h] = _14.sent();
                        _j = this.nativeModules;
                        _k = "dev.itsu.node.html.HTMLInputElement";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/dev/itsu/node/html/HTMLInputElement.js")); })];
                    case 5:
                        _j[_k] = _14.sent();
                        _l = this.nativeModules;
                        _m = "dev.itsu.event.EventTarget";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/dev/itsu/event/EventTarget.js")); })];
                    case 6:
                        _l[_m] = _14.sent();
                        _o = this.nativeModules;
                        _p = "java.io.FileDescriptor";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/java/io/FileDescriptor.js")); })];
                    case 7:
                        _o[_p] = _14.sent();
                        _q = this.nativeModules;
                        _r = "java.io.FileOutputStream";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/java/io/FileOutputStream.js")); })];
                    case 8:
                        _q[_r] = _14.sent();
                        _s = this.nativeModules;
                        _t = "java.lang.Class";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/java/lang/Class.js")); })];
                    case 9:
                        _s[_t] = _14.sent();
                        _u = this.nativeModules;
                        _v = "java.lang.Object";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/java/lang/JavaObject.js")); })];
                    case 10:
                        _u[_v] = _14.sent();
                        _w = this.nativeModules;
                        _x = "java.lang.Runtime";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/java/lang/Runtime.js")); })];
                    case 11:
                        _w[_x] = _14.sent();
                        _y = this.nativeModules;
                        _z = "java.lang.String";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/java/lang/String.js")); })];
                    case 12:
                        _y[_z] = _14.sent();
                        _0 = this.nativeModules;
                        _1 = "java.lang.System";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/java/lang/System.js")); })];
                    case 13:
                        _0[_1] = _14.sent();
                        _2 = this.nativeModules;
                        _3 = "java.lang.Thread";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/java/lang/Thread.js")); })];
                    case 14:
                        _2[_3] = _14.sent();
                        _4 = this.nativeModules;
                        _5 = "java.lang.invoke.MethodHandleNatives";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/java/lang/invoke/MethodHandleNatives.js")); })];
                    case 15:
                        _4[_5] = _14.sent();
                        _6 = this.nativeModules;
                        _7 = "java.security.AccessController";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/java/security/AccessController.js")); })];
                    case 16:
                        _6[_7] = _14.sent();
                        _8 = this.nativeModules;
                        _9 = "sun.misc.VM";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/sun/misc/VM.js")); })];
                    case 17:
                        _8[_9] = _14.sent();
                        _10 = this.nativeModules;
                        _11 = "sun.misc.Unsafe";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/sun/misc/Unsafe.js")); })];
                    case 18:
                        _10[_11] = _14.sent();
                        _12 = this.nativeModules;
                        _13 = "sun.reflect.Reflection";
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("../../lib/sun/reflect/Reflection.js")); })];
                    case 19:
                        _12[_13] = _14.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RuntimeDataArea.prototype.createThread = function (stackSize, isCurrent) {
        var _this = this;
        this.stackArea[this.threadId] = new Promise(function (resolve) {
            var thread = new Thread_js_1.default(_this, stackSize, _this.threadId);
            if (isCurrent) {
                _this.currentThread = thread;
            }
            resolve(thread);
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
    RuntimeDataArea.prototype.createObject = function (className) {
        if (JavaClass_1.default.isPrimitive(className))
            className = JavaClass_1.default.box(className);
        var javaClass = BootstrapClassLoader_1.default.getInstance().findClass(className);
        var variables = new Array(javaClass.getFieldsCount());
        this.objectHeap.push(variables);
        if (document.getElementById("heap"))
            document.getElementById("heap").innerHTML += "<span>".concat(this.objectHeap.length - 1, ": ").concat(className, "<br /></span>");
        var obj = new types_1.JavaObject(BootstrapClassLoader_1.default.getInstance().findClass(javaClass.name), this.objectHeap.length - 1);
        obj.init(this);
        return obj;
    };
    RuntimeDataArea.prototype.createStringObject = function (thread, str) {
        var object = this.createObject("java.lang.String");
        var variables = this.objectHeap[object.heapIndex];
        var valueVar = variables.filter(function (value) { return value.name === "value"; })[0];
        valueVar.value = this._createPArray(8, Array.from(new TextEncoder().encode(str)));
        var hashVar = variables.filter(function (value) { return value.name === "hash"; })[0];
        hashVar.value = (0, Utils_1.hashString)(str);
        thread.invokeMethod("<init>", "(Ljava/lang/String;)V", object.type, [object], object);
        return object;
    };
    RuntimeDataArea.prototype.createClassObject = function (thread, klass) {
        if (klass.getClassObject() != null)
            return klass.getClassObject();
        var object = this.createObject("java.lang.Class");
        object.init(this);
        thread.invokeMethod("<init>", "(Ljava/lang/ClassLoader;)V", object.type, [null], object);
        var variables = this.objectHeap[object.heapIndex];
        variables.filter(function (value) { return value.name === "name"; })[0].value = this.createStringObject(thread, klass.name);
        /*
        const reverse = klass.name.split(".").reverse();
        reverse.pop();
        variables.filter(value => value.name === "packageName")[0].value = reverse.reverse().join(".");

         */
        variables.filter(function (value) { return value.name === "classLoader"; })[0].value = null;
        klass.setClassObject(object);
        return object;
    };
    RuntimeDataArea.prototype._createPArray = function (type, array) {
        this.objectHeap.push(array);
        var classes = {
            8: "java.lang.Byte",
            5: "java.lang.Character",
            7: "java.lang.Double",
            6: "java.lang.Float",
            10: "java.lang.Integer",
            11: "java.lang.Long",
            9: "java.lang.Short",
            4: "java.lang.Boolean"
        };
        return new types_1.JavaObject(BootstrapClassLoader_1.default.getInstance().findClass(classes[type]), this.objectHeap.length - 1, true);
    };
    RuntimeDataArea.prototype.createPArray = function (type, size) {
        var variables;
        var classes = {
            8: "java.lang.Byte",
            5: "java.lang.Character",
            7: "java.lang.Double",
            6: "java.lang.Float",
            10: "java.lang.Integer",
            11: "java.lang.Long",
            9: "java.lang.Short",
            4: "java.lang.Boolean"
        };
        if (type == 4) {
            variables = new Array(size).fill(false);
        }
        else {
            variables = new Array(size).fill(0);
        }
        this.objectHeap.push(variables);
        return new types_1.JavaObject(BootstrapClassLoader_1.default.getInstance().findClass(classes[type]), this.objectHeap.length - 1, true);
    };
    RuntimeDataArea.prototype.createAArray = function (typeName, size) {
        var objects = new Array(size).fill(null);
        this.objectHeap.push(objects);
        return new types_1.JavaObject(BootstrapClassLoader_1.default.getInstance().findClass(typeName), this.objectHeap.length - 1, true);
    };
    RuntimeDataArea.prototype.allocate = function (size) {
        var memory = new Array(size);
        this.objectHeap.push(memory);
        return this.objectHeap.length - 1;
    };
    RuntimeDataArea.prototype._createMDArray = function (typeName, dimension, sizes) {
        var initValue = null;
        if (JavaClass_1.default.isPrimitive(typeName) || JavaClass_1.default.isWrappedPrimitive(typeName)) {
            initValue = 0;
            if (typeName.includes("Boolean") || typeName.includes("Z")) {
                initValue = false;
            }
        }
        if (dimension > 0) {
            return new Array(sizes[sizes.length - dimension]).fill(this._createMDArray(typeName, dimension - 1, sizes));
        }
        else {
            return initValue;
        }
    };
    RuntimeDataArea.prototype.createMDArray = function (typeName, dimension, sizes) {
        var objects = this._createMDArray(typeName, dimension, sizes);
        this.objectHeap.push(objects);
        return new types_1.JavaObject(BootstrapClassLoader_1.default.getInstance().findClass(typeName), this.objectHeap.length - 1, true);
    };
    RuntimeDataArea.prototype.getCurrentThread = function () {
        return this.currentThread;
    };
    return RuntimeDataArea;
}());
exports.default = RuntimeDataArea;
//# sourceMappingURL=RuntimeDataArea.js.map