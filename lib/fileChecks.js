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
Object.defineProperty(exports, "__esModule", { value: true });
exports.releasesnodeModulesCheck = exports.nodeModulesCheck = exports.codeOwnerCheck = exports.readmeChecks = void 0;
function readmeChecks(repository, validationResultRepo, ownername, secret_token, octokit) {
    return __awaiter(this, void 0, void 0, function () {
        var result, current, contents, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/readme', {
                            repo: repository,
                            owner: ownername,
                            headers: {
                                Authorization: 'Bearer ' + secret_token
                            }
                        })];
                case 1:
                    result = _a.sent();
                    if (!(result.status == 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/contents/README.md', {
                            repo: repository,
                            owner: ownername,
                            headers: {
                                Authorization: 'Bearer ' + secret_token
                            }
                        })];
                case 2:
                    current = _a.sent();
                    contents = Buffer.from(current.data.content, "base64").toString("utf8");
                    if ((contents.includes('Example')) && (contents.includes('Contribution') || contents.includes('Contributing'))) {
                        validationResultRepo['readme'] = 'pass';
                    }
                    else {
                        validationResultRepo['readme'] = 'fail';
                    }
                    return [3 /*break*/, 4];
                case 3:
                    validationResultRepo['readme'] = 'fail';
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    if (err_1.status == 404)
                        validationResultRepo['readme'] = 'fail';
                    else
                        validationResultRepo['readme'] = err_1.status;
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, Promise.resolve(validationResultRepo)];
            }
        });
    });
}
exports.readmeChecks = readmeChecks;
function codeOwnerCheck(repository, validationResultRepo, ownername, secret_token, octokit) {
    return __awaiter(this, void 0, void 0, function () {
        var result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/contents/.github/CODEOWNERS', {
                            repo: repository,
                            owner: ownername,
                            headers: {
                                Authorization: 'Bearer ' + secret_token
                            }
                        })];
                case 1:
                    result = _a.sent();
                    if (result.status === 200) {
                        validationResultRepo['codeOwner'] = 'pass';
                    }
                    else {
                        validationResultRepo['codeOwner'] = 'fail';
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    if (err_2.status == 404)
                        validationResultRepo['codeOwner'] = 'fail';
                    else
                        validationResultRepo['codeOwner'] = err_2.status;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, Promise.resolve(validationResultRepo)];
            }
        });
    });
}
exports.codeOwnerCheck = codeOwnerCheck;
function nodeModulesCheck(repository, validationResultRepo, ownername, secret_token, octokit) {
    return __awaiter(this, void 0, void 0, function () {
        var result, includes_node_modules, err_3, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/languages', {
                            repo: repository,
                            owner: ownername,
                            headers: {
                                Authorization: 'Bearer ' + secret_token
                            }
                        })];
                case 1:
                    result = _a.sent();
                    if (!(result.data["TypeScript"] !== undefined)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/contents/node_modules', {
                            repo: repository,
                            owner: ownername,
                            headers: {
                                Authorization: 'Bearer ' + secret_token
                            }
                        })];
                case 3:
                    includes_node_modules = _a.sent();
                    if (includes_node_modules.status == 200) {
                        validationResultRepo['nodeModules(.TS)'] = 'fail';
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    if (err_3.status == 404)
                        validationResultRepo['nodeModules(.TS)'] = 'pass';
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    validationResultRepo['nodeModules(.TS)'] = 'NA';
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_4 = _a.sent();
                    validationResultRepo['nodeModules(.TS)'] = err_4.status;
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, Promise.resolve(validationResultRepo)];
            }
        });
    });
}
exports.nodeModulesCheck = nodeModulesCheck;
function releasesnodeModulesCheck(repository, validationResultRepo, ownername, secret_token, octokit) {
    return __awaiter(this, void 0, void 0, function () {
        var result, releaseFlag, i, branchname, contents, nodeModulesFlag, j, err_5, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/branches', {
                            owner: ownername,
                            repo: repository,
                            headers: {
                                Authorization: 'Bearer ' + secret_token
                            }
                        })];
                case 1:
                    result = _a.sent();
                    releaseFlag = false;
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < result.data.length)) return [3 /*break*/, 7];
                    if (!(result.data[i].name.substring(0, 9) === 'releases/')) return [3 /*break*/, 6];
                    releaseFlag = true;
                    branchname = result.data[i].name;
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/contents', {
                            owner: ownername,
                            repo: repository,
                            ref: branchname,
                            headers: {
                                Authorization: 'Bearer ' + secret_token
                            }
                        })];
                case 4:
                    contents = _a.sent();
                    nodeModulesFlag = false;
                    for (j = 0; j < contents.data.length; j++) {
                        if (contents.data[j].name === 'node_modules') {
                            nodeModulesFlag = true;
                            validationResultRepo['releasesnodeModules(.TS)'] = 'pass';
                        }
                    }
                    if (nodeModulesFlag == false) {
                        validationResultRepo['releasesnodeModules(.TS)'] = 'fail';
                        return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_5 = _a.sent();
                    validationResultRepo['releasesnodeModules(.TS)'] = err_5.status;
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 2];
                case 7:
                    if (!releaseFlag) {
                        validationResultRepo['releasesnodeModules(.TS)'] = 'NA';
                    }
                    return [3 /*break*/, 9];
                case 8:
                    err_6 = _a.sent();
                    validationResultRepo['releasesnodeModules(.TS)'] = err_6.status;
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, Promise.resolve(validationResultRepo)];
            }
        });
    });
}
exports.releasesnodeModulesCheck = releasesnodeModulesCheck;
