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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.updateMessage = void 0;
function updateMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.db.transaction((t) => __awaiter(this, void 0, void 0, function* () {
            let newId;
            if (message.id.startsWith("temp")) {
                const messageWithoutId = Object.assign({}, message);
                delete messageWithoutId.id;
                [newId] = yield t("messages").insert(messageWithoutId);
            }
            else {
                yield t("messages").update(Object.assign({}, message));
            }
            return newId === null || newId === void 0 ? void 0 : newId.toString();
        }));
    });
}
exports.updateMessage = updateMessage;
function getMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        return [];
    });
}
exports.getMessages = getMessages;
