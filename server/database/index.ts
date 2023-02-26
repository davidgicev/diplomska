import * as sqlite from "sqlite3"
import * as sqlite3 from "sqlite3";
import Message from "../types/message";
import User from "../types/user";
import Chat from "../types/chat";
import * as messageDB from "./message"
import * as userDB from "./user"
import * as chatDB from "./chat"
import { Knex, knex } from "knex";

export const DBSOURCE = "db.sqlite"

export class DBContext {
    db: Knex
    
    updateUser: typeof userDB.updateUser
    getUsers: typeof userDB.getUsers
    updateMessage: typeof messageDB.updateMessage
    getMessages: typeof messageDB.getMessages
    getMessagesForChat: typeof messageDB.getMessagesForChat
    updateChat: typeof  chatDB.updateChat
    getChats: typeof chatDB.getChats
    getChatsForUser: typeof chatDB.getChatsForUser
    
    constructor() {
        this.initializeDatabase();
        this.updateUser = userDB.updateUser.bind(this)
        this.getUsers = userDB.getUsers.bind(this)
        this.updateMessage = messageDB.updateMessage.bind(this)
        this.getMessages = messageDB.getMessages.bind(this)
        this.getMessagesForChat = messageDB.getMessagesForChat.bind(this)
        this.updateChat =  chatDB.updateChat.bind(this)
        this.getChats = chatDB.getChats.bind(this)
        this.getChatsForUser = chatDB.getChatsForUser.bind(this)
    }

    async initializeDatabase() {
        const db = knex({
            client: "sqlite3",
            connection: {
                filename: "./db.sqlite",
            },
        })

        try {

            await db.transaction(async (t) => {
                
                // await t.schema.dropTableIfExists("users")
                // await t.schema.dropTableIfExists("chats")
                // await t.schema.dropTableIfExists("messages")
                // await t.schema.dropTableIfExists("usersChats")

                await t.schema.createTableIfNotExists('users', table => {
                    table.increments('id')
                    table.string('username')
                    table.string('firstName')
                    table.string('lastName')
                    table.string('photo')
                    table.integer('lastUpdated')
                })
        
                await t.schema.createTableIfNotExists('chats', table => {
                    table.increments('id')
                    table.string('tempId')
                    table.string('title')
                    table.string('photo')
                    table.string('type')
                    table.integer('lastUpdated')
                })
        
                await t.schema.createTableIfNotExists('messages', table => {
                    table.increments('id')
                    table.string('tempId')
                    table.string('content')
                    table.string('tempChatId')
                    table.integer('lastUpdated')
                    table.integer('date').unsigned()
                    table.integer('chatId').unsigned()
                    table.integer('fromUserId').unsigned()
                    table.foreign('fromUserId').references('id').inTable('users')
                    table.foreign('chatId').references('id').inTable('chats')
                })
        
                await t.schema.createTableIfNotExists("usersChats", table => {
                    table.integer('userId').unsigned()
                    table.integer('chatId').unsigned()
                    table.foreign('userId').references('id').inTable('users')
                    table.foreign('chatId').references('id').inTable('chats')
                })
            })
        
            this.db = db
        }
        catch (e) {
            console.log(e)
        }
    }


}