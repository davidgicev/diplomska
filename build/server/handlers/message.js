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
exports.updateMessage = void 0;
function updateMessage(server, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, chatId, tempId, } = message;
        let newId = id;
        if (id === tempId) {
            newId = yield server.db.updateMessage(message);
        }
        const userIds = (yield server.db.db("usersChats").where({ chatId }).select('userId')).map(r => r.userId);
        const connections = server.ws.users;
        for (const userId of userIds) {
            if (!(userId in connections)) {
                return;
            }
            const connection = connections[userId];
            server.ws.sendTo(connection, {
                type: "upsertMessage",
                data: Object.assign(Object.assign({}, message), { id: newId !== undefined ? newId : id, tempId,
                    chatId, lastUpdated: message.lastUpdated + 1 })
            });
        }
    });
}
exports.updateMessage = updateMessage;
