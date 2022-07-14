"use strict";
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
exports.throwErrorOrException = exports.JVM = void 0;
var ByteBuffer_js_1 = require("./utils/ByteBuffer.js");
var RuntimeDataArea_js_1 = __importDefault(require("./core/rda/RuntimeDataArea.js"));
var ClassFileLoader_js_1 = __importDefault(require("./core/cfl/ClassFileLoader.js"));
var fflate_1 = require("fflate");
var JVM = /** @class */ (function () {
    function JVM(array, jvmArgs, args) {
        this.buffer = new ByteBuffer_js_1.ByteBuffer(array);
        this.jvmArgs = jvmArgs;
        this.args = args;
        this.runtimeDataArea = new RuntimeDataArea_js_1.default();
    }
    JVM.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.buffer) {
                            console.error("buffer must not be undefined!");
                            return [2 /*return*/];
                        }
                        if (!this.isClassFile()) return [3 /*break*/, 1];
                        this.processClassFile();
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.processJarFile()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JVM.prototype.isClassFile = function () {
        var magic = this.buffer.getUint32();
        this.buffer.offset = 0;
        return magic == 0xCAFEBABE;
    };
    JVM.prototype.processClassFile = function () {
        var _this = this;
        var classFile = ClassFileLoader_js_1.default.loadClassFile(".", this.buffer);
        console.log(classFile);
        this.runtimeDataArea
            .createThread(this.jvmArgs["Xss"])
            .then(function (thread) { return thread.invokeMethod("main", classFile, _this.args); });
    };
    JVM.prototype.processJarFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.buffer.offset = 0;
                (0, fflate_1.unzip)(new Uint8Array(this.buffer.view.buffer), (function (err, data) {
                    var manifest = JVM.loadManifest(data);
                    var mainClass = manifest["Main-Class"];
                    _this.buffer = new ByteBuffer_js_1.ByteBuffer(data[mainClass.replaceAll(".", "/") + ".class"].buffer);
                    JVM.loadedJars.push({
                        manifest: manifest,
                        unzipped: data
                    });
                    var classFile = ClassFileLoader_js_1.default.loadClassFile(mainClass.replaceAll(".", "/"), _this.buffer);
                    console.log(classFile);
                    _this.runtimeDataArea
                        .createThread(_this.jvmArgs["Xss"])
                        .then(function (thread) { return thread.invokeMethod("main", classFile, _this.args); });
                }));
                return [2 /*return*/];
            });
        });
    };
    JVM.getClassFile = function (path) {
        if (!(ClassFileLoader_js_1.default.loadedClassFiles[path] == null)) {
            return ClassFileLoader_js_1.default.loadedClassFiles[path];
        }
        for (var _i = 0, _a = JVM.loadedJars; _i < _a.length; _i++) {
            var jarFile = _a[_i];
            if (!(jarFile.unzipped[path + ".class"] == null)) {
                return ClassFileLoader_js_1.default.loadClassFile(path, new ByteBuffer_js_1.ByteBuffer(jarFile.unzipped[path + ".class"].buffer));
            }
        }
        return null;
    };
    JVM.loadManifest = function (data) {
        var manifest = new TextDecoder().decode(data["META-INF/MANIFEST.MF"]);
        var manifestData = {};
        for (var _i = 0, _a = manifest.split("\r\n"); _i < _a.length; _i++) {
            var line = _a[_i];
            var _b = line.split(": "), key = _b[0], value = _b[1];
            if (!(value == null))
                manifestData[key] = value;
        }
        return manifestData;
    };
    JVM.loadedJars = [];
    return JVM;
}());
exports.JVM = JVM;
var throwErrorOrException = function (throwable) {
    throwable.printStackTrace();
};
exports.throwErrorOrException = throwErrorOrException;
//# sourceMappingURL=jvm.js.map