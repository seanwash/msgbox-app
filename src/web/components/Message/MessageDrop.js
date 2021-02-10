"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.__esModule = true;
var react_1 = require("react");
var msgreader_1 = require("@npeersab/msgreader");
var electron_1 = require("electron");
var react_query_1 = require("react-query");
var MessageDrop = function () {
    var _a = react_1.useState(), fileList = _a[0], setFileList = _a[1];
    var _b = react_1.useState(false), importing = _b[0], setImporting = _b[1];
    var queryClient = react_query_1.useQueryClient();
    var mutation = react_query_1.useMutation(function (_a) {
        var message = _a.message;
        return electron_1.ipcRenderer.invoke("createMessage", message);
    });
    var onFileChange = function (e) {
        var files = e.currentTarget.files;
        if (files) {
            setFileList(files);
        }
    };
    var onSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var importedFileCount_1, i, file, fileReader;
        return __generator(this, function (_a) {
            e.preventDefault();
            setImporting(true);
            if (fileList === null || fileList === void 0 ? void 0 : fileList.length) {
                importedFileCount_1 = 0;
                for (i = 0; i < fileList.length; i++) {
                    file = fileList.item(i);
                    fileReader = new FileReader();
                    // TODO: Handle errors, test with INVALID message file
                    fileReader.onload = function (e) { return __awaiter(void 0, void 0, void 0, function () {
                        var buffer, msgReader, fileData, attachments;
                        var _a;
                        return __generator(this, function (_b) {
                            buffer = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                            msgReader = new msgreader_1["default"](buffer);
                            fileData = msgReader.getFileData();
                            attachments = fileData.attachments.map(function (attachment, index) {
                                // Returns fileName & content
                                var file = msgReader.getAttachment(index);
                                return __assign(__assign({}, attachment), { file: file });
                            });
                            mutation.mutate({
                                message: __assign(__assign({}, fileData), { recipients: JSON.stringify(fileData.recipients), attachments: JSON.stringify(attachments) })
                            });
                            return [2 /*return*/];
                        });
                    }); };
                    // eslint-disable-next-line no-loop-func
                    fileReader.onloadend = function () {
                        if (importedFileCount_1 < fileList.length - 1) {
                            importedFileCount_1 += 1;
                        }
                        else {
                            setImporting(false);
                            queryClient.invalidateQueries("messages");
                        }
                    };
                    fileReader.readAsArrayBuffer(file);
                }
            }
            return [2 /*return*/];
        });
    }); };
    return (<form className="bg-blue-100 p-4" onSubmit={onSubmit}>
      <div>
        <label htmlFor="files" className="sr-only">
          MSG Files
        </label>
        <input className="w-full" id="files" type="file" multiple onChange={onFileChange}/>
      </div>

      <div className="mt-4">
        <input disabled={importing} className="block w-full py-2 px-4 rounded-sm cursor-pointer bg-blue-800 text-white disabled:opacity-50" type="submit" value="View Contents"/>
      </div>
    </form>);
};
exports["default"] = MessageDrop;
