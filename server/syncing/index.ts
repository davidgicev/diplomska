import MerkleTree from "merkletreejs"
import Server from "../Server"
import SHA256 from "crypto-js/sha256"
import { updateUser } from "server/database/user"
import { WSMessage } from "server/types/WSMessage"
import { ShallowSyncBody, ShallowSyncBodyMessage, SyncChanges, MessagesSyncBody, MessagesSyncBodyMessage, SyncChangesMessages, SyncChangesInternal } from "syncing/protocolMessageTypes"
import { User, Chat, Message } from "syncing/protocolObjectTypes"
import { DBUtils, findDifferenceBetweenShallow, makeMessagesSyncBody, makeShallowSyncBody } from "../../syncing/helpers"
import WebSocketServer from "server/WebSocketServer"

export class SyncManager {
    context: WebSocketServer

    constructor(server: WebSocketServer) {
        this.context = server

        this.generateChanges = this.generateChanges.bind(this)
        this.generateChangesMessages = this.generateChangesMessages.bind(this)
        this.handleSyncResponseShallow = this.handleSyncResponseShallow.bind(this)
        this.handleSyncResponseMessages = this.handleSyncResponseMessages.bind(this)
    }

    async generateChanges(utils: DBUtils, local: ShallowSyncBody, incoming: ShallowSyncBodyMessage): Promise<SyncChangesInternal> {
        const userDiffs = findDifferenceBetweenShallow(local.packet.users, incoming.users)
        const userChanges: User[] = []
        for (const diff of userDiffs) {
            if (diff.type === "change") {
                const userIndex = local.trees.users.getLeafIndex(Buffer.from(diff.key, 'hex'))
                const user = (await utils.getUsers())[userIndex]
                userChanges.push(user)
                continue
            }
            if (diff.type === "insertionLocal") {
                const userIndex = local.trees.users.getLeafIndex(Buffer.from(diff.key, 'hex'))
                const user = (await utils.getUsers())[userIndex]
                userChanges.push(user)
                continue
            }
        }
    
        const chatDiffs = findDifferenceBetweenShallow(local.packet.chats, incoming.chats)
        const chatChanges: Chat[] = []
        for (const diff of chatDiffs) {
            if (diff.type === "change") {
                const chatIndex = local.trees.chats.getLeafIndex(Buffer.from(diff.key, 'hex'))
                const chat = (await utils.getChats())[chatIndex]
                chatChanges.push(chat)
                continue
            }
            if (diff.type === "insertionLocal") {
                const chatIndex = local.trees.chats.getLeafIndex(Buffer.from(diff.key, 'hex'))
                const chat = (await utils.getChats())[chatIndex]
                chatChanges.push(chat)
                continue
            }
        }

        if (userChanges.length || chatChanges.length) {
            return {
                users: userChanges,
                chats: chatChanges,
                messageChangedInChatIds: null,
            }
        }

        const messageDiffs = findDifferenceBetweenShallow(local.packet.messages, incoming.messages)
        const messageChangedInChatIds: number[] = []
        for (const diff of messageDiffs) {
            if (diff.type === "change") {
                const chatIndex = local.trees.messages.getLeafIndex(Buffer.from(diff.key, 'hex'))
                const chat = (await utils.getChats())[chatIndex]
                messageChangedInChatIds.push(Number(chat.id))
                continue
            }
            if (diff.type === "insertionLocal") {
                const chatIndex = local.trees.messages.getLeafIndex(Buffer.from(diff.key, 'hex'))
                const chat = (await utils.getChats())[chatIndex]
                messageChangedInChatIds.push(Number(chat.id))
                continue
            }
        }
    
        return {
            users: userChanges,
            chats: chatChanges,
            messageChangedInChatIds,
        }
    }
    
    
    async generateChangesMessages(utils: DBUtils, local: MessagesSyncBody, incoming: MessagesSyncBodyMessage): Promise<SyncChangesMessages> {
        const messageChanges: Message[] = []
        for (let i=0; i<local.packet.chats.length; i++) {
            const { id, tree: hash } = local.packet.chats[i]
            const { tree } = local.trees.chats[i]
    
            const diffs = findDifferenceBetweenShallow(hash, incoming.chats[id])
            for (const diff of diffs) {
                if (diff.type === "change" || diff.type === "insertionLocal") {
                    const messageIndex = tree.getLeafIndex(Buffer.from(diff.key, 'hex'))
                    const message = (await utils.getMessagesForChat(id))[messageIndex]
                    messageChanges.push(message)
                    continue
                }
            }
        }
    
        return {
            messages: messageChanges,
        }
    }
    
    
    async handleSyncResponseShallow(message: WSMessage, userId: number) {
        if (message.type !== "syncResponseShallow") {
            return
        }
    
        const changes = message.data.changes
    
        let newChanges: SyncChangesInternal | undefined;
        let syncBody: ShallowSyncBody | undefined;

        let syncBodyMessages: MessagesSyncBody | undefined;

        await this.context.context.db.db.transaction(async (db) => {
            for (const user of changes.users) {
                const local: User = await db("users").select("*").where({ id: user.id }).first()
                if (!local) {
                    await db("users").insert(user)
                    continue
                }
                if (local.lastUpdated > user.lastUpdated) {
                    continue
                }
                await db("users").update(user)
            }
            for (const chat of changes.chats) {
                if (chat.id === chat.tempId) {
                    // mozhebi treba i da se smenat messages sami po sebe od tuka direkno uwu
                    const modified = { ...chat }
                    const id = await db("chats").insert(chat)
                    modified.id = id.toString()
                    modified.lastUpdated++
                    continue
                }
                const chatIdAsNumber = Number(chat.id)
                const local: Chat = await db("chats").select("*").where({ id: chatIdAsNumber }).first()
                if (!local) {
                    await db("chats").insert(chat)
                    continue
                }
                if (local.lastUpdated > chat.lastUpdated) {
                    continue
                }
                await db("chats").update({ ...chat, id: chatIdAsNumber })
            }

            const utils: DBUtils = {
                getUsers: async() => {
                    return await db("users").select("*")
                },
                getChats: async() => {
                    const chats = (await db.raw(`
                        SELECT *, group_concat(userId) as userIds FROM usersChats
                        JOIN chats ON usersChats.chatId = chats.id
                        WHERE userId = ?
                        GROUP BY chats.id
                    `, [userId]))
                    return chats.map(chat => ({
                        ...chat,
                        userIds: chat.userIds.split(",").map(Number)
                    }))
                },
                getMessagesForChat: async(id: number) => {
                    return await db("messages").where({ chatId: id }).select("*")
                },
            }

            syncBody = await makeShallowSyncBody(utils)
            const incoming = message.data.syncBody
    
            newChanges = await this.generateChanges(utils, syncBody, incoming)
            
            if (!newChanges.chats.length && !newChanges.users.length && newChanges.messageChangedInChatIds) {
                syncBodyMessages = await makeMessagesSyncBody(utils, newChanges.messageChangedInChatIds)
            }
        })  

        if (!newChanges) {
            return
        }
        
        const hasChangeInUsers = newChanges.users.length > 0
        const hasChangeInChats = newChanges.chats.length > 0
        const hasChangeInMessages = !!syncBodyMessages

        if (!hasChangeInUsers && !hasChangeInChats) {
            if (!hasChangeInMessages) {
                return
            }
            this.context.sendTo( this.context.users[userId], {
                type: "syncResponseMessages",
                data: {
                    syncBody: {
                        shallowChats: syncBody.packet.messages,
                        chats: Object.fromEntries(syncBodyMessages.packet.chats.map(chat => [chat.id, chat.tree])),
                    },
                    changes: {
                        messages: []
                    }
                }
            })
            return
        }
        
        this.context.sendTo( this.context.users[userId], {
            type: "syncResponseShallow",
            data: {
                syncBody: syncBody.packet,
                changes: newChanges,
            }
        })
    }
    
    async handleSyncResponseMessages(message: WSMessage, userId: number) {
        if (message.type !== "syncResponseMessages") {
            return
        }
        
        const changes = message.data.changes.messages
    
        let newChanges: SyncChangesMessages | undefined;
        let syncBody: MessagesSyncBody | undefined;
    
        await this.context.context.db.db.transaction(async (db) => {
            for (const message of changes) {
                if (message.id === message.tempId) {
                    const modified = { ...message }
                    const id = await db("messages").insert(message)
                    modified.id = id.toString()
                    modified.lastUpdated++
                    continue
                }

                const messageIdAsNumber = Number(message.id)
                const local: Message = await db("messages").where({ id: messageIdAsNumber }).first("*")
                if (!local) {
                    await db("messages").insert(message)
                    continue
                }
                if (local.lastUpdated > message.lastUpdated) {
                    continue
                }
                await db("messages").update({...message, id: messageIdAsNumber})
            }

            const utils: DBUtils = {
                getUsers: async() => {
                    return await db("users").select("*")
                },
                getChats: async() => {
                    return await db("usersChats").select("*").join("chats", function() {
                        this.on("usersChats.chatId", "=", "chats.id")
                    }).where({ userId })
                },
                getMessagesForChat: async(id: number) => {
                    return await db("messages").select("*").where({ chatId: id })
                },
            }
    
            const incoming = message.data.syncBody
            let chatIds: number[] = [];
            if (incoming.shallowChats) {
                const local = await makeShallowSyncBody(utils)
                const messageDiffs = findDifferenceBetweenShallow(local.packet.messages, incoming.shallowChats)
                const messageChangedInChatIds: number[] = []
                for (const diff of messageDiffs) {
                    if (diff.type === "insertionLocal") {
                        const chatIndex = local.trees.messages.getLeafIndex(Buffer.from(diff.key, 'hex'))
                        const chat = (await utils.getChats())[chatIndex]
                        messageChangedInChatIds.push(Number(chat.id))
                        continue
                    }
                }
                chatIds.push(...messageChangedInChatIds)
            }
            // tuka vidi dali ke raboti yes yes
            chatIds.push(...Object.keys(incoming.chats).map(Number))

            syncBody = await makeMessagesSyncBody(utils, chatIds)
    
            newChanges = await this.generateChangesMessages(utils, syncBody, incoming)
        })
    
        if (newChanges && newChanges.messages.length === 0) {
            return
        }
    
        if (!newChanges || !syncBody) {
            throw new Error("neshto utna negde")
        }
    
        this.context.sendTo( this.context.users[userId], {
            type: "syncResponseMessages",
            data: {
                syncBody: {
                    shallowChats: null,
                    chats: Object.fromEntries(syncBody.packet.chats.map(chat => [chat.id, chat.tree])),
                },
                changes: newChanges,
            }
        })
    }
}