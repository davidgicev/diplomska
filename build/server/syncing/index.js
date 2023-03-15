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
exports.SyncManager = void 0;
const helpers_1 = require("../../syncing/helpers");
class SyncManager {
    constructor(server) {
        this.context = server;
        this.generateChanges = this.generateChanges.bind(this);
        this.generateChangesMessages = this.generateChangesMessages.bind(this);
        this.handleSyncResponseShallow = this.handleSyncResponseShallow.bind(this);
        this.handleSyncResponseMessages = this.handleSyncResponseMessages.bind(this);
    }
    generateChanges(utils, local, incoming) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDiffs = (0, helpers_1.findDifferenceBetweenShallow)(local.packet.users, incoming.users);
            const userChanges = [];
            for (const diff of userDiffs) {
                if (diff.type === "change") {
                    const userIndex = local.trees.users.getLeafIndex(Buffer.from(diff.key, 'hex'));
                    const user = (yield utils.getUsers())[userIndex];
                    userChanges.push(user);
                    continue;
                }
                if (diff.type === "insertionLocal") {
                    const userIndex = local.trees.users.getLeafIndex(Buffer.from(diff.key, 'hex'));
                    const user = (yield utils.getUsers())[userIndex];
                    userChanges.push(user);
                    continue;
                }
            }
            const chatDiffs = (0, helpers_1.findDifferenceBetweenShallow)(local.packet.chats, incoming.chats);
            const chatChanges = [];
            for (const diff of chatDiffs) {
                if (diff.type === "change") {
                    const chatIndex = local.trees.chats.getLeafIndex(Buffer.from(diff.key, 'hex'));
                    const chat = (yield utils.getChats())[chatIndex];
                    chatChanges.push(chat);
                    continue;
                }
                if (diff.type === "insertionLocal") {
                    const chatIndex = local.trees.chats.getLeafIndex(Buffer.from(diff.key, 'hex'));
                    const chat = (yield utils.getChats())[chatIndex];
                    chatChanges.push(chat);
                    continue;
                }
            }
            if (userChanges.length || chatChanges.length) {
                return {
                    users: userChanges,
                    chats: chatChanges,
                    messageChangedInChatIds: null,
                };
            }
            const messageDiffs = (0, helpers_1.findDifferenceBetweenShallow)(local.packet.messages, incoming.messages);
            const messageChangedInChatIds = [];
            for (const diff of messageDiffs) {
                if (diff.type === "change") {
                    const chatIndex = local.trees.messages.getLeafIndex(Buffer.from(diff.key, 'hex'));
                    const chat = (yield utils.getChats())[chatIndex];
                    messageChangedInChatIds.push(Number(chat.id));
                    continue;
                }
                if (diff.type === "insertionLocal") {
                    const chatIndex = local.trees.messages.getLeafIndex(Buffer.from(diff.key, 'hex'));
                    const chat = (yield utils.getChats())[chatIndex];
                    messageChangedInChatIds.push(Number(chat.id));
                    continue;
                }
            }
            return {
                users: userChanges,
                chats: chatChanges,
                messageChangedInChatIds,
            };
        });
    }
    generateChangesMessages(utils, local, incoming) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageChanges = [];
            for (let i = 0; i < local.packet.chats.length; i++) {
                const { id, tree: hash } = local.packet.chats[i];
                const { tree } = local.trees.chats[i];
                const diffs = (0, helpers_1.findDifferenceBetweenShallow)(hash, incoming.chats[id]);
                for (const diff of diffs) {
                    if (diff.type === "change" || diff.type === "insertionLocal") {
                        const messageIndex = tree.getLeafIndex(Buffer.from(diff.key, 'hex'));
                        const message = (yield utils.getMessagesForChat(id))[messageIndex];
                        messageChanges.push(message);
                        continue;
                    }
                }
            }
            return {
                messages: messageChanges,
            };
        });
    }
    handleSyncResponseShallow(message, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.type !== "syncResponseShallow") {
                return;
            }
            const changes = message.data.changes;
            let newChanges;
            let syncBody;
            let syncBodyMessages;
            yield this.context.context.db.db.transaction((db) => __awaiter(this, void 0, void 0, function* () {
                for (const user of changes.users) {
                    const local = yield db("users").select("*").where({ id: user.id }).first();
                    if (!local) {
                        yield db("users").insert(user);
                        continue;
                    }
                    if (local.lastUpdated > user.lastUpdated) {
                        continue;
                    }
                    yield db("users").update(user);
                }
                for (const chat of changes.chats) {
                    const userIds = chat.userIds;
                    delete chat.userIds;
                    if (chat.id === chat.tempId) {
                        // mozhebi treba i da se smenat messages sami po sebe od tuka direkno uwu
                        const modified = Object.assign({}, chat);
                        delete modified.id;
                        modified.lastUpdated++;
                        yield db("chats").where({ tempId: modified.tempId }).delete();
                        const id = yield db("chats").insert(modified);
                        yield Promise.all(userIds.map(userId => db("usersChats").insert({ userId, chatId: id })));
                        yield db("messages").where({ chatId: modified.tempId }).update({ chatId: id });
                        continue;
                    }
                    const chatIdAsNumber = Number(chat.id);
                    const local = yield db("chats").select("*").where({ id: chatIdAsNumber }).first();
                    if (!local) {
                        const id = yield db("chats").insert(chat);
                        yield Promise.all(userIds.map(userId => db("usersChats").insert({ userId, chatId: id })));
                        continue;
                    }
                    if (local.lastUpdated >= chat.lastUpdated) {
                        continue;
                    }
                    yield db("usersChats").where({ chatId: chatIdAsNumber }).delete();
                    yield Promise.all(userIds.map(userId => db("usersChats").insert({ userId, chatId: chatIdAsNumber })));
                    yield db("chats").update(Object.assign(Object.assign({}, chat), { id: chatIdAsNumber }));
                }
                const utils = {
                    getUsers: () => __awaiter(this, void 0, void 0, function* () {
                        return yield db("users").select("*");
                    }),
                    getChats: () => __awaiter(this, void 0, void 0, function* () {
                        const chats = (yield db.raw(`
                        SELECT *, group_concat(userId) as userIds FROM usersChats
                        JOIN chats ON usersChats.chatId = chats.id
                        WHERE chats.id IN (
                            SELECT UC.chatId FROM usersChats as UC WHERE UC.userId = ?
                        )
                        GROUP BY chatId
                    `, [userId]));
                        return chats.map(chat => {
                            const modified = Object.assign({}, chat);
                            delete modified.userId;
                            delete modified.chatId;
                            return Object.assign(Object.assign({}, modified), { userIds: chat.userIds.split(",").map(Number) });
                        });
                    }),
                    getMessagesForChat: (id) => __awaiter(this, void 0, void 0, function* () {
                        return yield db("messages").where({ chatId: id }).select("*");
                    }),
                };
                syncBody = yield (0, helpers_1.makeShallowSyncBody)(utils);
                const incoming = message.data.syncBody;
                newChanges = yield this.generateChanges(utils, syncBody, incoming);
                if (!newChanges.chats.length && !newChanges.users.length && newChanges.messageChangedInChatIds) {
                    syncBodyMessages = yield (0, helpers_1.makeMessagesSyncBody)(utils, newChanges.messageChangedInChatIds);
                }
            }));
            if (!newChanges) {
                return;
            }
            const hasChangeInUsers = (0, helpers_1.checkIfMTHashIsDifferent)(syncBody.packet.users, message.data.syncBody.users);
            const hasChangeInChats = (0, helpers_1.checkIfMTHashIsDifferent)(syncBody.packet.chats, message.data.syncBody.chats);
            const hasChangeInMessages = !!syncBodyMessages;
            if (!hasChangeInUsers && !hasChangeInChats) {
                if (!hasChangeInMessages) {
                    return;
                }
                this.context.sendTo(this.context.users[userId], {
                    type: "syncResponseMessages",
                    data: {
                        syncBody: {
                            shallowChats: syncBody.packet.messages,
                            chats: Object.fromEntries(syncBodyMessages.packet.chats.map(chat => [chat.id, chat.tree])),
                        },
                        changes: {
                            messages: []
                        }
                    }
                });
                return;
            }
            this.context.sendTo(this.context.users[userId], {
                type: "syncResponseShallow",
                data: {
                    syncBody: syncBody.packet,
                    changes: newChanges,
                }
            });
        });
    }
    handleSyncResponseMessages(message, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.type !== "syncResponseMessages") {
                return;
            }
            const changes = message.data.changes.messages;
            let newChanges;
            let syncBody;
            yield this.context.context.db.db.transaction((db) => __awaiter(this, void 0, void 0, function* () {
                for (const message of changes) {
                    if (message.id === message.tempId) {
                        const local = yield db("messages").where({ tempId: message.tempId }).first("*");
                        if (!local) {
                            const modified = Object.assign({}, message);
                            delete modified.id;
                            modified.lastUpdated++;
                            yield db("messages").insert(modified);
                            continue;
                        }
                        if (local.lastUpdated >= message.lastUpdated) {
                            continue;
                        }
                        yield db("messages").where({ id: local.id }).update(Object.assign(Object.assign({}, message), { id: local.id }));
                        continue;
                    }
                    const messageIdAsNumber = Number(message.id);
                    const local = yield db("messages").where({ id: messageIdAsNumber }).first("*");
                    if (!local) {
                        yield db("messages").insert(message);
                        continue;
                    }
                    if (local.lastUpdated >= message.lastUpdated) {
                        continue;
                    }
                    yield db("messages").where({ id: messageIdAsNumber }).update(Object.assign(Object.assign({}, message), { id: messageIdAsNumber }));
                }
                const utils = {
                    getUsers: () => __awaiter(this, void 0, void 0, function* () {
                        return yield db("users").select("*");
                    }),
                    getChats: () => __awaiter(this, void 0, void 0, function* () {
                        return yield db("usersChats").select("*").join("chats", function () {
                            this.on("usersChats.chatId", "=", "chats.id");
                        }).where({ userId });
                    }),
                    getMessagesForChat: (id) => __awaiter(this, void 0, void 0, function* () {
                        return yield db("messages").select("*").where({ chatId: id });
                    }),
                };
                const incoming = message.data.syncBody;
                let chatIds = [];
                if (incoming.shallowChats) {
                    const local = yield (0, helpers_1.makeShallowSyncBody)(utils);
                    const messageDiffs = (0, helpers_1.findDifferenceBetweenShallow)(local.packet.messages, incoming.shallowChats);
                    const messageChangedInChatIds = [];
                    for (const diff of messageDiffs) {
                        if (diff.type === "insertionLocal") {
                            const chatIndex = local.trees.messages.getLeafIndex(Buffer.from(diff.key, 'hex'));
                            const chat = (yield utils.getChats())[chatIndex];
                            messageChangedInChatIds.push(Number(chat.id));
                            continue;
                        }
                    }
                    chatIds.push(...messageChangedInChatIds);
                }
                // tuka vidi dali ke raboti yes yes
                chatIds.push(...Object.keys(incoming.chats).map(Number));
                syncBody = yield (0, helpers_1.makeMessagesSyncBody)(utils, chatIds);
                newChanges = yield this.generateChangesMessages(utils, syncBody, incoming);
            }));
            if (!message.data.syncBody && newChanges && newChanges.messages.length === 0) {
                return;
            }
            if (!newChanges || !syncBody) {
                throw new Error("neshto utna negde");
            }
            this.context.sendTo(this.context.users[userId], {
                type: "syncResponseMessages",
                data: {
                    syncBody: {
                        shallowChats: null,
                        chats: Object.fromEntries(syncBody.packet.chats.map(chat => [chat.id, chat.tree])),
                    },
                    changes: newChanges,
                }
            });
        });
    }
}
exports.SyncManager = SyncManager;
