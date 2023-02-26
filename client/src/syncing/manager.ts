import { db } from "../database"
import { 
    makeShallowSyncBody as makeShallowSyncBodyHelper, 
    makeMessagesSyncBody as makeMessagesSyncBodyHelper, 
    DBUtils 
} from "../syncing/helpers"
import { MessagesSyncBody, ShallowSyncBody } from "./protocolMessageTypes"


export class SyncManager {

    utils: DBUtils = {
        getChats: async() => {
            return await db.chats.toArray()
        },
        getUsers: async() => {
            return await db.users.toArray()
        },
        getMessagesForChat: async(id: number) => {
            return await db.messages.where({ chatId: id }).toArray()
        }
    }

    async makeShallowSyncBody(): Promise<ShallowSyncBody> {
        return makeShallowSyncBodyHelper(this.utils)
    }

    async makeMessagesSyncBody(chatIds: number[]): Promise<MessagesSyncBody> {
        return makeMessagesSyncBodyHelper(this.utils, chatIds)
    }
}