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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askSync = exports.ask = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const postUrl = 'https://asked.kr/query.php?query=0';
function ask(id, question) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = new URLSearchParams();
        params.append("id", id);
        params.append("content", question);
        params.append("makarong_bat", "-1");
        params.append("show_user", "0");
        yield node_fetch_1.default(postUrl, {
            method: 'POST',
            body: params
        });
    });
}
exports.ask = ask;
function askSync(id, question) {
    const params = new URLSearchParams();
    params.append("id", id);
    params.append("content", question);
    params.append("makarong_bat", "-1");
    params.append("show_user", "0");
    node_fetch_1.default(postUrl, {
        method: 'POST',
        body: params
    });
}
exports.askSync = askSync;
//# sourceMappingURL=index.js.map