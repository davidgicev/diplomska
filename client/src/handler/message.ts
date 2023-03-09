import { db } from "../database";

export async function updateMessage(message: Store.Message) {
    await db.transaction("rw", db.messages, async () => {
        if (message.id !== message.tempId) {
            await db.messages.where("tempId").equals(message.tempId).delete()
        }
        const existing = await db.messages.get(message.id)
        if (existing && existing.lastUpdated >= message.lastUpdated) {
            return;
        }
        await db.messages.put(message)
    })
}
