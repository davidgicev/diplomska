import Dexie from "dexie";

export class Database extends Dexie {
    users!:    Dexie.Table<Store.User, number>
    chats!:    Dexie.Table<Store.Chat, string>
    messages!: Dexie.Table<Store.Message, string>

    constructor () {
        super("Database")

        this.version(1).stores({
            chats: "id, tempId",
            users: "id",
            messages: "id, chatId, tempId", 
        })
    }
}

export const db = new Database()