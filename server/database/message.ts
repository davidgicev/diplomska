import Message from "../types/message";
import { DBContext } from "./"

export async function updateMessage (this: DBContext, message: Message): Promise<string | undefined> {
    return await this.db.transaction(async (t) => {
        let newId: number | undefined;
        if (message.id.startsWith("temp")) {
            const messageWithoutId = {...message}
            delete messageWithoutId.id;
            [newId] = await t("messages").insert(messageWithoutId)
        }
        else {
            await t("messages").update({
                ...message
            })
        }

        return newId?.toString()
    })
}

export async function getMessages(this: DBContext): Promise<Message[]> {
    return this.db("messages").select("*")
}

export async function getMessagesForChat(this: DBContext, chatId: number): Promise<Message[]> {
    return this.db("messages").select("*").where({ chatId })
}
