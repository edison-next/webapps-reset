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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
const xml2js = __importStar(require("xml2js"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appName = core.getInput('app-name');
            const publishProfile = core.getInput('publish-profile');
            // Parse the publish profile
            const parser = new xml2js.Parser();
            const result = yield parser.parseStringPromise(publishProfile);
            const profile = result.publishData.publishProfile[0].$;
            const userName = profile.userName;
            const password = profile.userPWD;
            const scmUri = profile.publishUrl;
            // Construct the URL
            const url = `https://${scmUri}/api/command`;
            // Make the POST request to restart the web app
            const response = yield axios_1.default.post(url, { command: 'restart' }, {
                auth: {
                    username: userName,
                    password: password,
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                const webappUrl = profile.destinationAppUrl;
                core.setOutput('webapp-url', webappUrl);
                console.log(`App Service Application URL: ${webappUrl}`);
            }
            else {
                throw new Error(`Failed to restart web app. Status code: ${response.status}`);
            }
        }
        catch (error) {
            core.setFailed(`Action failed with error: ${error.message}`);
        }
    });
}
run();
