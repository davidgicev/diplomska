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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBContext = exports.DBSOURCE = void 0;
const messageDB = __importStar(require("./message"));
const userDB = __importStar(require("./user"));
const chatDB = __importStar(require("./chat"));
const knex_1 = require("knex");
exports.DBSOURCE = "db.sqlite";
class DBContext {
    constructor() {
        this.initializeDatabase();
        this.updateUser = userDB.updateUser.bind(this);
        this.getUsers = userDB.getUsers.bind(this);
        this.updateMessage = messageDB.updateMessage.bind(this);
        this.getMessages = messageDB.getMessages.bind(this);
        this.getMessagesForChat = messageDB.getMessagesForChat.bind(this);
        this.updateChat = chatDB.updateChat.bind(this);
        this.getChats = chatDB.getChats.bind(this);
        this.getChatsForUser = chatDB.getChatsForUser.bind(this);
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (0, knex_1.knex)({
                client: "sqlite3",
                connection: {
                    filename: "./db.sqlite",
                },
            });
            try {
                yield db.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    // await t.schema.dropTableIfExists("users")
                    // await t.schema.dropTableIfExists("chats")
                    // await t.schema.dropTableIfExists("messages")
                    // await t.schema.dropTableIfExists("usersChats")
                    yield t.schema.createTableIfNotExists('users', table => {
                        table.increments('id');
                        table.string('username');
                        table.string('firstName');
                        table.string('lastName');
                        table.string('photo');
                        table.integer('lastUpdated');
                    });
                    yield t.schema.createTableIfNotExists('chats', table => {
                        table.increments('id');
                        table.string('tempId');
                        table.string('title');
                        table.string('photo');
                        table.string('type');
                        table.integer('lastUpdated');
                    });
                    yield t.schema.createTableIfNotExists('messages', table => {
                        table.increments('id');
                        table.string('tempId');
                        table.string('content');
                        table.string('tempChatId');
                        table.integer('lastUpdated');
                        table.boolean('deleted');
                        table.integer('date').unsigned();
                        table.integer('chatId').unsigned();
                        table.integer('fromUserId').unsigned();
                        table.foreign('fromUserId').references('id').inTable('users');
                        table.foreign('chatId').references('id').inTable('chats');
                    });
                    yield t.schema.createTableIfNotExists("usersChats", table => {
                        table.integer('userId').unsigned();
                        table.integer('chatId').unsigned();
                        table.foreign('userId').references('id').inTable('users');
                        table.foreign('chatId').references('id').inTable('chats');
                    });
                }));
                this.db = db;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.DBContext = DBContext;
