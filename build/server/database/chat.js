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
exports.getChats = exports.updateChat = void 0;
function updateChat(chat) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.db.transaction((t) => __awaiter(this, void 0, void 0, function* () {
            let newId;
            if (chat.id.startsWith("temp") || chat.id === "") {
                [newId] = yield t("chats").insert({
                    tempId: chat.tempId,
                    title: chat.title,
                    type: chat.type,
                });
                for (const userId of chat.userIds) {
                    yield t("usersChats").insert({
                        userId,
                        chatId: newId !== null && newId !== void 0 ? newId : chat.id,
                    });
                }
            }
            else {
                [newId] = yield t("chats").update({
                    id: chat.id,
                    tempId: chat.tempId,
                    title: chat.title,
                    type: chat.type,
                });
                // add/remove lugje chat
                // for (const userId of chat.userIds) {
                //     await t("usersChats").update({
                //         userId,
                //         chatId: newId ?? chat.id,
                //     })
                // }
            }
            return newId === null || newId === void 0 ? void 0 : newId.toString();
        }));
    });
}
exports.updateChat = updateChat;
function getChats() {
    return __awaiter(this, void 0, void 0, function* () {
        return Object.values(this.fakeDB.chats);
    });
}
exports.getChats = getChats;
