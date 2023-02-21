import { db } from "../database";

export async function updateMessage(message: Store.Message) {
    await db.messages.put(message)
}
