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
import URLConnection from "./URLConnection.js";
import ByteArrayInputStream from "../io/ByteArrayInputStream.js";
var HttpURLConnection = /** @class */ (function (_super) {
    __extends(HttpURLConnection, _super);
    function HttpURLConnection(u) {
        var _this = _super.call(this, u) || this;
        _this.instanceFollowRedirects = false;
        _this.method = "GET";
        _this.responseCode = -1;
        _this.responseMessage = null;
        _this.requestHeaders = {};
        return _this;
    }
    HttpURLConnection.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.connected)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetch(this.url.toString(), {
                                method: this.method,
                                "mode": "cors"
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        this.responseCode = response.status;
                        this.responseMessage = response.statusText;
                        this.inputStream = new ByteArrayInputStream(new TextEncoder().encode(text));
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HttpURLConnection.prototype.setRequestMethod = function (method) {
        this.method = method;
    };
    HttpURLConnection.prototype.getRequestMethod = function () {
        return this.method;
    };
    HttpURLConnection.HTTP_ACCEPTED = 202;
    HttpURLConnection.HTTP_BAD_GATEWAY = 502;
    HttpURLConnection.HTTP_BAD_METHOD = 405;
    HttpURLConnection.HTTP_BAD_REQUEST = 400;
    HttpURLConnection.HTTP_CLIENT_TIMEOUT = 408;
    HttpURLConnection.HTTP_CONFLICT = 409;
    HttpURLConnection.HTTP_CREATED = 201;
    HttpURLConnection.HTTP_ENTITY_TOO_LARGE = 413;
    HttpURLConnection.HTTP_FORBIDDEN = 403;
    HttpURLConnection.HTTP_GATEWAY_TIMEOUT = 504;
    HttpURLConnection.HTTP_GONE = 410;
    HttpURLConnection.HTTP_INTERNAL_ERROR = 500;
    HttpURLConnection.HTTP_LENGTH_REQUIRED = 411;
    HttpURLConnection.HTTP_MOVED_PERM = 301;
    HttpURLConnection.HTTP_MOVED_TEMP = 302;
    HttpURLConnection.HTTP_MULT_CHOICE = 300;
    HttpURLConnection.HTTP_NO_CONTENT = 204;
    HttpURLConnection.HTTP_NOT_ACCEPTABLE = 406;
    HttpURLConnection.HTTP_NOT_AUTHORITATIVE = 203;
    HttpURLConnection.HTTP_NOT_FOUND = 404;
    HttpURLConnection.HTTP_NOT_IMPLEMENTED = 501;
    HttpURLConnection.HTTP_NOT_MODIFIED = 304;
    HttpURLConnection.HTTP_OK = 200;
    HttpURLConnection.HTTP_PARTIAL = 206;
    HttpURLConnection.HTTP_PAYMENT_REQUIRED = 402;
    HttpURLConnection.HTTP_PRECON_FAILED = 412;
    HttpURLConnection.HTTP_PROXY_AUTH = 407;
    HttpURLConnection.HTTP_REQ_TOO_LONG = 414;
    HttpURLConnection.HTTP_RESET = 205;
    HttpURLConnection.HTTP_SEE_OTHER = 303;
    HttpURLConnection.HTTP_UNAUTHORIZED = 401;
    HttpURLConnection.HTTP_UNAVAILABLE = 503;
    HttpURLConnection.HTTP_UNSUPPORTED_TYPE = 415;
    HttpURLConnection.HTTP_USE_PROXY = 305;
    HttpURLConnection.HTTP_VERSION = 505;
    return HttpURLConnection;
}(URLConnection));
export default HttpURLConnection;
//# sourceMappingURL=HttpURLConnection.js.map