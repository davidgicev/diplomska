import Message from "../types/message";
import { DBContext } from "./"

export default function attachMessageHandlers(this: DBContext) {
    this.updateMessage = (message: Message): string | undefined => {
        // this.db.run(`
        //     INSERT INTO message (content, from_user, to_user)
        //     VALUES (?, ?, ?)
        // `, message.content, message.from_user, message.to_user)
        if (message.id in this.fakeDB.messages) {
            this.fakeDB.messages = {
                ...this.fakeDB.messages,
                [message.id]: {
                    ...this.fakeDB.messages[message.id],
                    ...message,
                }
            }
            return
        }
        else {
            const id = Date.now().toString()
            this.fakeDB.messages = {
                ...this.fakeDB.messages,
                [id]: message,
            }   
            return id
        }
    }

    this.getMessages = async () => {
        // const result = await this.db.all<Message[]>(`
        //     SELECT * FROM message
        // `)
        return Object.values(this.fakeDB.messages)
    }
}
