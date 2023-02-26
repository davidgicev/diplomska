import Chat from "../types/chat"
import { DBContext } from "./"

export async function updateChat(this: DBContext, chat: Chat): Promise<string | number | undefined> {
    return await this.db.transaction(async (t) => {
        let newId: number | undefined;
        if (chat.id !== chat.tempId) {
            [newId] = await t("chats").insert({
                tempId: chat.tempId,
                title: chat.title,
                type: chat.type,
            })
            for (const userId of chat.userIds) {
                await t("usersChats").insert({
                    userId,
                    chatId: newId ?? chat.id,
                })
            }
        }
        else {
            [newId] = await t("chats").update({
                id: chat.id,
                tempId: chat.tempId,
                title: chat.title,
                type: chat.type,
            })
            
            // add/remove lugje chat
            // for (const userId of chat.userIds) {
            //     await t("usersChats").update({
            //         userId,
            //         chatId: newId ?? chat.id,
            //     })
            // }
        }

        return newId
    })
}

export async function getChats(this: DBContext): Promise<Chat[]> {
    return await this.db("chats").select("*")
}

export async function getChatsForUser(this: DBContext, userId: number): Promise<Chat[]> {
    return await this.db("chats").select("*").where({ id: userId })
}
