import { db } from "../database";

export async function updateChat(chat: Store.Chat) {
    await db.chats.put(chat)
}
