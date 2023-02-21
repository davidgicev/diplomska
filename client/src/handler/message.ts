import { db } from "../database";

export async function updateMessage(message: Store.Message) {
    await db.transaction("rw", db.messages, async () => {
        if (message.id !== message.tempId) {
            if (await db.messages.get(message.tempId)) {
                db.messages.delete(message.tempId)
            }
        }
        await db.messages.put(message)
    })
}
