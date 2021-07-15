"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueTemplateCheck = void 0;
var core = __importStar(require("@actions/core"));
var fs = __importStar(require("fs"));
function issueTemplateCheck() {
    fs.readdir('./.github', function (err, folders) {
        var includesISSUE_TEMPLATE = folders.includes('ISSUE_TEMPLATE');
        if (includesISSUE_TEMPLATE) {
            console.log('Success - ISSUE_TEMPLATE is set up');
            defaultLabelCheck();
        }
        else {
            core.setFailed('Please set up ISSUE_TEMPLATE');
        }
    });
}
exports.issueTemplateCheck = issueTemplateCheck;
function defaultLabelCheck() {
    fs.readdir('./.github/ISSUE_TEMPLATE', function (err, filelist) {
        var i = 0;
        while (i < filelist.length) {
            if (getExtension(filelist[i]) === 'md') {
                var data = fs.readFileSync('./.github/ISSUE_TEMPLATE/' + filelist[i]);
                if (data.includes('need-to-triage')) {
                    console.log('Success - Default label is need-to-triage');
                    break;
                }
            }
            i++;
        }
        if (i == filelist.length)
            core.setFailed('Please set default label as need-to-triage');
    });
}
function getExtension(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length);
}
