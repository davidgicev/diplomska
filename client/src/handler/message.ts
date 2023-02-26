import { db } from "../database";

export async function updateMessage(message: Store.Message) {
    await db.transaction("rw", db.messages, async () => {
        if (message.id !== message.tempId) {
            await db.messages.where("tempId").equals(message.tempId).delete()
        }
        await db.messages.put(message)
    })
}
