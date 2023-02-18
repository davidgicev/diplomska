import * as sqlite from "sqlite3"
import * as sqlite3 from "sqlite3";
import Message from "types/message";
import User from "types/user";
import attachMessageHandlers from "./message"
import attachUserHandlers from "./user"
import { open, Database } from "sqlite";

export const DBSOURCE = "db.sqlite"

export class DBContext {
    db: Database
    createMessage: (message: Omit<Message, "id">) => void;
    getMessages: () => Promise<Message[]>;
    createUser: (user: Omit<User, "id">) => void;
    getUsers: () => Promise<User[]>;
    
    constructor() {
        this.initializeDatabase();

        attachMessageHandlers.bind(this)();        
        attachUserHandlers.bind(this)();        
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