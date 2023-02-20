import * as sqlite from "sqlite3"
import * as sqlite3 from "sqlite3";
import Message from "../types/message";
import User from "../types/user";
import Chat from "../types/chat";
import attachMessageHandlers from "./message"
import attachUserHandlers from "./user"
import attachChatHandlers from "./chat"
import { open, Database } from "sqlite";

export const DBSOURCE = "db.sqlite"

export class DBContext {
    db: Database
    fakeDB = {
        messages: {} as Record<string, Message>,
        users:    {} as Record<string, User>,
        chats:    {} as Record<string, Chat>,
    }
    updateMessage: (message: Message) => string | undefined;
    getMessages: () => Promise<Message[]>;
    updateUser: (user: User) => void;
    getUsers: () => Promise<User[]>;
    updateChat: (chat: Chat) => void;
    getChats: () => Promise<Chat[]>;
    
    constructor() {
        this.initializeDatabase();

        attachMessageHandlers.bind(this)();        
        attachUserHandlers.bind(this)();        
        attachChatHandlers.bind(this)();        
    }

    async initializeDatabase() {
        this.db = await open({filename: DBSOURCE, driver: sqlite3.Database})
        console.log('Connected to the SQLite database.')

        await this.db.exec(`PRAGMA foreign_keys = 1`)

        await this.db.run(`
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text
            );
        `);

        await this.db.run(`
            CREATE TABLE IF NOT EXISTS message (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                from_user INTEGER,
                to_user   INTEGER,
                content      text,
                FOREIGN KEY (from_user) REFERENCES user (id),
                FOREIGN KEY (to_user)   REFERENCES user (id)
            );   
        `);
    }


}