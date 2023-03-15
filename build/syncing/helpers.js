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
exports.makeMessagesSyncBody = exports.makeShallowSyncBody = exports.traverseToEnd = exports.findDifferenceBetweenShallow = exports.checkIfMTHashIsDifferent = void 0;
const crypto_js_1 = require("crypto-js");
const merkletreejs_1 = __importDefault(require("merkletreejs"));
const object_hash_1 = require("object-hash");
function checkIfMTHashIsDifferent(current, other) {
    if (!current && !other) {
        return false;
    }
    const currentKeys = current ? Object.keys(current) : [];
    const otherKeys = other ? Object.keys(other) : [];
    if (currentKeys.length === otherKeys.length && currentKeys.length === 1 && currentKeys[0] === otherKeys[0]) {
        return false;
    }
    return true;
}
exports.checkIfMTHashIsDifferent = checkIfMTHashIsDifferent;
function findDifferenceBetweenShallow(current, other) {
    if (!current && !other) {
        return [];
    }
    const currentKeys = current ? Object.keys(current) : [];
    const otherKeys = other ? Object.keys(other) : [];
    const length = Math.min(currentKeys.length, otherKeys.length);
    const diffs = [];
    for (let i = 0; i < length; i++) {
        const currentKey = currentKeys[i];
        const otherKey = otherKeys[i];
        if (currentKey === otherKey) {
            continue;
        }
        if (!current[currentKey] && !other[otherKey]) {
            diffs.push({ type: "change", key: currentKey });
            continue;
        }
        diffs.push(...findDifferenceBetweenShallow(current[currentKey], other[otherKey]));
    }
    const isLocalLonger = currentKeys.length > otherKeys.length;
    const longerObject = isLocalLonger ? current : other;
    const longerArray = Object.keys(longerObject);
    for (let i = length; i < longerArray.length; i++) {
        const key = longerArray[i];
        if (!longerObject[key]) {
            diffs.push({ key, type: isLocalLonger ? "insertionLocal" : "insertionIncoming" });
            continue;
        }
        diffs.push(...traverseToEnd(longerObject[key]).map((key) => ({
            key,
            type: isLocalLonger ? "insertionLocal" : "insertionIncoming"
        })));
    }
    return diffs;
}
exports.findDifferenceBetweenShallow = findDifferenceBetweenShallow;
function traverseToEnd(node) {
    const diffs = [];
    const keys = Object.keys(node);
    if (!keys.length) {
        return diffs;
    }
    for (const key of keys) {
        if (!node[key]) {
            diffs.push(key);
            continue;
        }
        diffs.push(...traverseToEnd(node[key]));
    }
    return diffs;
}
exports.traverseToEnd = traverseToEnd;
function makeShallowSyncBody(utils) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield utils.getUsers();
        const hashedUsers = users.map((u, i) => (0, object_hash_1.sha1)(u) + i);
        const usersObject = new merkletreejs_1.default(hashedUsers);
        const chats = yield utils.getChats();
        const hashedChats = chats.map((c, i) => (0, object_hash_1.sha1)(c) + i);
        const chatsObject = new merkletreejs_1.default(hashedChats);
        const hashedMessages = [];
        for (const chat of chats) {
            const messages = yield utils.getMessagesForChat(Number(chat.id));
            hashedMessages.push((0, crypto_js_1.SHA256)(messages.map((m) => (0, object_hash_1.sha1)(m)).join("") + hashedMessages.length));
        }
        const messagesObject = new merkletreejs_1.default(hashedMessages);
        return {
            packet: {
                users: usersObject.getLayersAsObject(),
                chats: chatsObject.getLayersAsObject(),
                messages: messagesObject.getLayersAsObject()
            },
            trees: {
                users: usersObject,
                chats: chatsObject,
                messages: messagesObject
            },
        };
    });
}
exports.makeShallowSyncBody = makeShallowSyncBody;
function makeMessagesSyncBody(utils, chatIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const chats = {};
        for (const chatId of chatIds) {
            const chatIdAsNumber = Number(chatId);
            const messages = yield utils.getMessagesForChat(chatIdAsNumber);
            const hashedMessages = messages.map((m, i) => (0, object_hash_1.sha1)(m) + i);
            chats[chatIdAsNumber] = new merkletreejs_1.default(hashedMessages);
        }
        return {
            packet: {
                chats: Object.entries(chats).map(([id, tree]) => { var _a; return ({ id: Number(id), tree: (_a = tree.getLayersAsObject()) !== null && _a !== void 0 ? _a : {} }); })
            },
            trees: {
                chats: Object.entries(chats).map(([id, tree]) => ({ id: Number(id), tree }))
            },
        };
    });
}
exports.makeMessagesSyncBody = makeMessagesSyncBody;
