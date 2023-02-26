import Dexie from "dexie";

export class Database extends Dexie {
    users!:    Dexie.Table<Store.User, number>
    chats!:    Dexie.Table<Store.Chat, string | number>
    messages!: Dexie.Table<Store.Message, string | number>

    constructor () {
        super("Database")

        this.version(1).stores({
            chats: "id, tempId",
            users: "id",
            messages: "id, chatId, tempId, tempChatId", 
        })
    }
}

export const db = new Database()