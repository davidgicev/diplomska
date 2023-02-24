import * as sqlite from "sqlite3"
import * as sqlite3 from "sqlite3";
import Message from "../types/message";
import User from "../types/user";
import Chat from "../types/chat";
import * as messageDB from "./message"
import * as userDB from "./user"
import * as chatDB from "./chat"
import { open, Database } from "sqlite";
import { Knex, knex } from "knex";

export const DBSOURCE = "db.sqlite"

export class DBContext {
    db: Knex
    fakeDB = {
        messages: {} as Record<string, Message>,
        users:    {} as Record<string, User>,
        chats:    {} as Record<string, Chat>,
    }
    updateMessage = messageDB.updateMessage.bind(this)
    getMessages = messageDB.getMessages.bind(this)
    updateUser =  userDB.updateUser.bind(this)
    getUsers = userDB.getUsers.bind(this)
    updateChat =  chatDB.updateChat.bind(this)
    getChats = chatDB.getChats.bind(this)
    
    constructor() {
        this.initializeDatabase();
    }

    async initializeDatabase() {
        // this.db = await open({filename: DBSOURCE, driver: sqlite3.Database})
        // console.log('Connected to the SQLite database.')

        // await this.db.exec(`PRAGMA foreign_keys = 1`)

        // await this.db.run(`
        //     CREATE TABLE IF NOT EXISTS user (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT,
        //         name text
        //     );
        // `);

        // await this.db.run(`
        //     CREATE TABLE IF NOT EXISTS message (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT,
        //         from_user INTEGER,
        //         to_user   INTEGER,
        //         content      text,
        //         FOREIGN KEY (from_user) REFERENCES user (id),
        //         FOREIGN KEY (to_user)   REFERENCES user (id)
        //     );   
        // `);

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
                })
        
                await t.schema.createTableIfNotExists('chats', table => {
                    table.increments('id')
                    table.string('tempId')
                    table.string('title')
                    table.string('photo')
                    table.string('type')
                })
        
                await t.schema.createTableIfNotExists('messages', table => {
                    table.increments('id')
                    table.string('tempId')
                    table.string('content')
                    table.string('tempChatId')
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