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
exports.updateUser = exports.initializeUser = exports.userLoggedIn = void 0;
const chat_1 = require("./chat");
function userLoggedIn(server, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const connections = server.ws.users;
        for (const id in connections) {
            const connection = connections[id];
            server.ws.sendTo(connection, {
                type: "upsertUser",
                data: {
                    id: userId,
                }
            });
        }
    });
}
exports.userLoggedIn = userLoggedIn;
function initializeUser(server, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUserId = (yield server.db.updateUser(user));
        yield server.db.db.transaction((db) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            {
                // check if new user has chat with self
                const existingPrivateChatId = (_a = (yield db.raw(`
                                                SELECT * from usersChats
                                                JOIN chats on usersChats.chatId = chats.id
                                                WHERE type = 'private' AND usersChats.userId = ?
                                                GROUP BY usersChats.chatId
                                                HAVING COUNT(*) = 1
                                            `, [newUserId]))[0]) === null || _a === void 0 ? void 0 : _a.chatId;
                if (existingPrivateChatId === undefined) {
                    const id = yield db("chats").insert({
                        title: "Saved Messages",
                        type: "private",
                        tempId: "",
                    });
                    yield db("usersChats").insert({
                        userId: newUserId,
                        chatId: id,
                    });
                }
                else {
                    // // ova ke ne treba vo idnina
                    // const [ existingChat ] = await server.db.db("chats").where({ id: existingPrivateChatId }).select("*")
                    // server.ws.sendTo(server.ws.users[newUserId], {
                    //     type: "upsertChat",
                    //     data: existingChat,
                    // })
                }
            }
            const users = yield db("users").select("*");
            for (const user of users) {
                const userId = user.id;
                if (user.id === newUserId) {
                    continue;
                }
                const existingPrivateChatId = (_b = (yield db.raw(`
                                                SELECT * from usersChats
                                                JOIN chats on usersChats.chatId = chats.id
                                                WHERE type = 'private' AND
                                                (usersChats.userId = ? OR usersChats.userId = ? )
                                                GROUP BY usersChats.chatId
                                                HAVING COUNT(*) = 2
                                            `, [user.id, newUserId]))[0]) === null || _b === void 0 ? void 0 : _b.chatId;
                if (existingPrivateChatId === undefined) {
                    const newChatId = yield db("chats").insert({
                        title: "",
                        type: "private",
                        tempId: "",
                    });
                    yield db("usersChats").insert({
                        userId: newUserId,
                        chatId: newChatId
                    });
                    yield db("usersChats").insert({
                        userId: userId,
                        chatId: newChatId
                    });
                }
            }
        }));
        return newUserId;
    });
}
exports.initializeUser = initializeUser;
function updateUser(server, user) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const connections = server.ws.users;
        const newUserId = (_a = (yield server.db.updateUser(user))) !== null && _a !== void 0 ? _a : user.id;
        for (const userId in connections) {
            const connection = connections[userId];
            server.ws.sendTo(connection, {
                type: "upsertUser",
                data: {
                    id: newUserId,
                }
            });
        }
        {
            // check if new user has chat with self
            const existingPrivateChatId = (_b = (yield server.db.db.raw(`
                                            SELECT * from usersChats
                                            JOIN chats on usersChats.chatId = chats.id
                                            WHERE type = 'private' AND usersChats.userId = ?
                                            GROUP BY usersChats.chatId
                                            HAVING COUNT(*) = 1
                                        `, [newUserId]))[0]) === null || _b === void 0 ? void 0 : _b.chatId;
            if (existingPrivateChatId === undefined) {
                (0, chat_1.updateChat)(server, {
                    id: "",
                    title: "",
                    type: "private",
                    userIds: [newUserId],
                    tempId: "",
                });
            }
            else {
                // ova ke ne treba vo idnina
                const [existingChat] = yield server.db.db("chats").where({ id: existingPrivateChatId }).select("*");
                server.ws.sendTo(server.ws.users[newUserId], {
                    type: "upsertChat",
                    data: existingChat,
                });
            }
        }
        for (const userId in connections) {
            const userIdAsNumber = Number(userId);
            if (userIdAsNumber === newUserId) {
                continue;
            }
            const existingPrivateChatId = (_c = (yield server.db.db.raw(`
                                            SELECT * from usersChats
                                            JOIN chats on usersChats.chatId = chats.id
                                            WHERE type = 'private' AND
                                            (usersChats.userId = ? OR usersChats.userId = ? )
                                            GROUP BY usersChats.chatId
                                            HAVING COUNT(*) = 2
                                        `, [userIdAsNumber, newUserId]))[0]) === null || _c === void 0 ? void 0 : _c.chatId;
            if (existingPrivateChatId === undefined) {
                (0, chat_1.updateChat)(server, {
                    id: "",
                    title: "",
                    type: "private",
                    userIds: newUserId === userIdAsNumber ? [userIdAsNumber] : [newUserId, userIdAsNumber],
                    tempId: "",
                });
            }
            else {
                const [existingChat] = yield server.db.db("chats").where({ id: existingPrivateChatId }).select("*");
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
