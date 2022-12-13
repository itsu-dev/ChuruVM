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
var fflate_1 = require("fflate");
var BootstrapClassLoader_1 = __importDefault(require("./core/BootstrapClassLoader"));
var Thread_1 = require("./lib/java/lang/Thread");
var OutputLogger_1 = require("./utils/OutputLogger");
var JVM = /** @class */ (function () {
    function JVM(array, fileName, jvmArgs, args, onLaunch) {
        this.buffer = array;
        this.fileName = fileName;
        this.jvmArgs = jvmArgs;
        this.args = args;
        this.onLaunch = onLaunch;
        this.runtimeDataArea = new RuntimeDataArea_js_1.default();
    }
    JVM.prototype.launch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.buffer) {
                            console.error("buffer must not be undefined!");
                            return [2 /*return*/];
                        }
                        if (!(this.jvmArgs["logger"] == null)) {
                            OutputLogger_1.OutputLogger.setLogger(this.jvmArgs["logger"]);
                        }
                        return [4 /*yield*/, this.loadLibraries()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JVM.prototype.onLibrariesLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        BootstrapClassLoader_1.default.getInstance().setRuntimeDataArea(this.runtimeDataArea);
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
        var buf = new ByteBuffer_js_1.ByteBuffer(this.buffer.buffer);
        var magic = buf.getUint32();
        return magic == 0xCAFEBABE;
    };
    JVM.prototype.processClassFile = function () {
        OutputLogger_1.OutputLogger.log("> java ".concat(this.fileName.replace(".class", "")));
        this.runtimeDataArea.loadedClasses[this.fileName.replace(".class", "")] = this.buffer;
        var javaClass = BootstrapClassLoader_1.default.getInstance().defineClass(this.fileName.replace(".class", ""), this.buffer);
        this.invokeMain(javaClass);
    };
    JVM.prototype.loadLibraries = function () {
        return __awaiter(this, void 0, void 0, function () {
            var libraries, checkForLibraries, unzipJar;
            var _this = this;
            return __generator(this, function (_a) {
                libraries = {
                    "/jvm-on-typescript/lib/rt.jar": false,
                    //"/jvm-on-typescript/lib/java-dom-api.jar": false
                };
                checkForLibraries = function () {
                    for (var _i = 0, _a = Object.keys(libraries); _i < _a.length; _i++) {
                        var key = _a[_i];
                        if (!libraries[key])
                            return false;
                    }
                    return true;
                };
                unzipJar = function (key, target) {
                    (0, fflate_1.unzip)(target, (function (err, data) {
                        var manifest = JVM.loadManifest(data);
                        _this.runtimeDataArea.loadedJars.push({
                            manifest: manifest,
                            unzipped: data
                        });
                        libraries[key] = true;
                        if (checkForLibraries()) {
                            _this.onLibrariesLoad();
                        }
                        //this.onLibrariesLoad();
                    }));
                };
                Object.keys(libraries).forEach(function (key) {
                    fetch(key).then(function (data) {
                        data.arrayBuffer().then(function (array) {
                            unzipJar(key, new Uint8Array(array));
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    JVM.prototype.processJarFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                OutputLogger_1.OutputLogger.log("> java -jar ".concat(this.fileName));
                (0, fflate_1.unzip)(new Uint8Array(this.buffer), (function (err, data) {
                    var manifest = JVM.loadManifest(data);
                    var mainClass = manifest["Main-Class"];
                    _this.buffer = new Uint8Array(data[mainClass.replaceAll(".", "/") + ".class"].buffer);
                    _this.runtimeDataArea.loadedJars.push({
                        manifest: manifest,
                        unzipped: data
                    });
                    var classFile = BootstrapClassLoader_1.default.getInstance().defineClass(mainClass, _this.buffer);
                    _this.invokeMain(classFile);
                }));
                return [2 /*return*/];
            });
        });
    };
    JVM.prototype.initializeVM = function (thread) {
        return __awaiter(this, void 0, void 0, function () {
            var system;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runtimeDataArea.registerNatives()];
                    case 1:
                        _a.sent();
                        BootstrapClassLoader_1.default.getInstance().findClass("java.lang.Class");
                        BootstrapClassLoader_1.default.getInstance().findClass("java.net.URLClassLoader");
                        system = BootstrapClassLoader_1.default.getInstance().findClass("java.lang.System");
                        system.initStatic(thread);
                        Thread_1.Thread.init(thread);
                        thread.invokeMethod("initializeSystemClass", "()V", system, []);
                        console.log("VM is Booted!");
                        return [2 /*return*/];
                }
            });
        });
    };
    JVM.prototype.invokeMain = function (classFile) {
        var _this = this;
        this.runtimeDataArea
            .createThread(this.jvmArgs["Xss"], true)
            .then(function (thread) {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initializeVM(thread)];
                        case 1:
                            _a.sent();
                            thread.invokeMethod("main", "([Ljava/lang/String;)V", classFile, this.args);
                            this.onLaunch();
                            return [2 /*return*/];
                    }
                });
            }); })();
        });
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
    return JVM;
}());
exports.JVM = JVM;
var throwErrorOrException = function (throwable) {
    throwable.printStackTrace();
};
exports.throwErrorOrException = throwErrorOrException;
//# sourceMappingURL=jvm.js.map