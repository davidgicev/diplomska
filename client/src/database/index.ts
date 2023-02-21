import Dexie from "dexie";

class Database extends Dexie {
    users!:    Dexie.Table<Store.User, string>
    chats!:    Dexie.Table<Store.Chat, string>
    messages!: Dexie.Table<Store.Message, string>

    constructor () {
        super("Database")

        this.version(1).stores({
            chats: "id",
            users: "id",
            messages: "id, chatId", 
        })
    }
}

export const db = new Database()