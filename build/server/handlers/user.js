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
exports.updateUser = void 0;
const chat_1 = require("./chat");
function updateUser(server, user) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const connections = server.ws.users;
        const newUserId = (_a = (yield server.db.updateUser(user))) !== null && _a !== void 0 ? _a : user.id;
        for (const userId in connections) {
            const connection = connections[userId];
            server.ws.sendTo(connection, {
                type: "upsertUser",
                data: {
                    id: newUserId,
                    username: user.username,
                }
            });
        }
        for (const userId in connections) {
            const userIdAsNumber = Number(userId);
            const existingPrivateChatId = yield ((_b = server.db.db.raw(`
                                            SELECT * from usersChats
                                            JOIN chats on usersChats.chatId = chats.id
                                            WHERE type = 'private'
                                            GROUP BY usersChats.chatId
                                            HAVING usersChats.userId IN ( ? , ? )
                                        `, [userIdAsNumber, newUserId])[0]) === null || _b === void 0 ? void 0 : _b.chatId);
            if (!existingPrivateChatId) {
                (0, chat_1.updateChat)(server, {
                    id: "",
                    title: "",
                    type: "private",
                    userIds: newUserId === userIdAsNumber ? [userIdAsNumber] : [newUserId, userIdAsNumber],
                    tempId: "",
                });
            }
            else {
                const existingChat = yield server.db.db("chats").where({ id: existingPrivateChatId }).select("*")[0];
                const userIds = (yield server.db.db("usersChats").where({ chatId: existingPrivateChatId }).select("userId")).map(r => r.userId);
                const connections = server.ws.users;
                for (const userId of userIds) {
                    const connection = connections[userId];
                    server.ws.sendTo(connection, {
                        type: "upsertChat",
                        data: Object.assign(Object.assign({}, existingChat), { userIds })
                    });
                }
            }
        }
    });
}
exports.updateUser = updateUser;
