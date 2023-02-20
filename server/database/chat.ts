import Chat from "../types/chat"
import { DBContext } from "./"

export default function attachChatHandlers(this: DBContext) {
    this.updateChat = (chat: Chat): void => {
        if (chat.id in this.fakeDB.chats) {
            this.fakeDB.chats = {
                ...this.fakeDB.chats,
                [chat.id]: {
                    ...this.fakeDB.chats[chat.id],
                    ...chat
                }
            }
        }
        else {
            this.fakeDB.chats = {
                ...this.fakeDB.chats,
                [chat.id]: chat,
            }
        }
        // this.db.run(`
        //     INSERT INTO user (name)
        //     VALUES (?)
        // `, user.name)
    }

    this.getChats = async () => {
        // const result = await this.db.all<User[]>(`
        //     SELECT * FROM user
        // `)
        return Object.values(this.fakeDB.chats)
    }
}
