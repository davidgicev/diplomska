import Message from "../../types/message";
import { DBContext } from "./"

export default function attachMessageHandlers(this: DBContext) {
    this.createMessage = (message: Omit<Message, "id">): void => {
        this.db.run(`
            INSERT INTO message (content, from_user, to_user)
            VALUES (?, ?, ?)
        `, message.content, message.from_user, message.to_user)
    }

    this.getMessages = async () => {
        const result = await this.db.all<Message[]>(`
            SELECT * FROM message
        `)
        return result
    }
}
