import { WSMessage } from "../types/WSMessage";
import { db } from "../database";
import { updateUser } from "../handler/user";
import ServerHandler from "./ServerHandler";
import { findDifferenceBetweenShallow } from "../syncing/helpers";
import { ShallowSyncBody, ShallowSyncBodyMessage, MessagesSyncBody, MessagesSyncBodyMessage, SyncChangesMessages, SyncChangesInternal } from "../syncing/protocolMessageTypes";
import { User, Chat, Message } from "../syncing/protocolObjectTypes";
import { Buffer } from "buffer"

async function generateChanges(local: ShallowSyncBody, incoming: ShallowSyncBodyMessage): Promise<SyncChangesInternal> {
    const userDiffs = findDifferenceBetweenShallow(local.packet.users, incoming.users)
    const userChanges: User[] = []

    for (const diff of userDiffs) {
        if (diff.type === "change") {
            const userIndex = local.trees.users.getLeafIndex(Buffer.from(diff.key, 'hex'))
            const user = (await db.users.toArray())[userIndex]
            userChanges.push(user)
            continue
        }
        if (diff.type === "insertionLocal") {
            const userIndex = local.trees.users.getLeafIndex(Buffer.from(diff.key, 'hex'))
            const user = (await db.users.toArray())[userIndex]
            userChanges.push(user)
            continue
        }
    }

    const chatDiffs = findDifferenceBetweenShallow(local.packet.chats, incoming.chats)
    const chatChanges: Chat[] = []
    for (const diff of chatDiffs) {
        if (diff.type === "change") {
            const chatIndex = local.trees.chats.getLeafIndex(Buffer.from(diff.key, 'hex'))
            const chat = (await db.chats.toArray())[chatIndex]
            chatChanges.push(chat)
            continue
        }
        if (diff.type === "insertionLocal") {
            const chatIndex = local.trees.chats.getLeafIndex(Buffer.from(diff.key, 'hex'))
            const chat = (await db.chats.toArray())[chatIndex]
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
            const chat = (await db.chats.toArray())[chatIndex]
            messageChangedInChatIds.push(Number(chat.id))
            continue
        }
        if (diff.type === "insertionLocal") {
            const chatIndex = local.trees.messages.getLeafIndex(Buffer.from(diff.key, 'hex'))
            const chat = (await db.chats.toArray())[chatIndex]
            messageChangedInChatIds.push(Number(chat.id))
            continue
        }
    }

    return {
        users: userChanges,
        chats: chatChanges,
        messageChangedInChatIds: messageChangedInChatIds.length ? messageChangedInChatIds : null,
    }
}


async function generateChangesMessages(local: MessagesSyncBody, incoming: MessagesSyncBodyMessage): Promise<SyncChangesMessages> {
    const messageChanges: Message[] = []
    for (let i=0; i<local.packet.chats.length; i++) {
        const { id, tree: hash } = local.packet.chats[i]
        const { tree } = local.trees.chats[i]

        const diffs = findDifferenceBetweenShallow(hash, incoming.chats[id])
        for (const diff of diffs) {
            if (diff.type === "change" || diff.type === "insertionLocal") {
                const messageIndex = tree.getLeafIndex(Buffer.from(diff.key, 'hex'))
                const message = (await db.messages.where("chatId").equals(id).toArray())[messageIndex]
                messageChanges.push(message)
                continue
            }
        }
    }

    return {
        messages: messageChanges,
    }
}


export async function handleSyncResponseShallow(this: ServerHandler, message: WSMessage) {
    if (message.type !== "syncResponseShallow") {
        return
    }

    const changes = message.data.changes

    let newChanges: SyncChangesInternal | undefined;
    let syncBody: ShallowSyncBody | undefined;

    let syncBodyMessages: MessagesSyncBody | undefined;

    await db.transaction("rw", [db.users, db.chats, db.messages], async (t) => {
        for (const user of changes.users) {
            const local = await db.users.get(user.id)
            if (!local) {
                await db.users.add(user)
                continue
            }
            if (local.lastUpdated > user.lastUpdated) {
                continue
            }
            updateUser(user)
        }
        for (const chat of changes.chats) {
            const local = await db.chats.get(chat.id)
            if (!local) {
                const temp = await db.chats.where("tempId").equals(chat.tempId).first()
                if (!temp) {
                    await db.chats.add(chat)
                    continue
                }
                await db.chats.put(chat)
                continue
            }
            if (local.lastUpdated > chat.lastUpdated) {
                continue
            }
            await db.chats.put(chat)
        }

        syncBody = await this.context.syncManager.makeShallowSyncBody()
        const incoming = message.data.syncBody

        newChanges = await generateChanges(syncBody, incoming)
        
        if (!newChanges.chats.length && !newChanges.users.length && newChanges.messageChangedInChatIds) {
            syncBodyMessages = await this.context.syncManager.makeMessagesSyncBody(newChanges.messageChangedInChatIds)
        }
    })

    if (!newChanges || !syncBody) {
        return
    }
    
    const hasChangeInUsers = newChanges.users.length > 0
    const hasChangeInChats = newChanges.chats.length > 0

    if (!hasChangeInUsers && !hasChangeInChats) {
        if (!syncBodyMessages) {
            return
        }
        this.context.serverHandler.send({
            type: "syncResponseMessages",
            data: {
                syncBody: {
                    chats: Object.fromEntries(syncBodyMessages.packet.chats.map(chat => [chat.id, chat.tree])),
                },
                changes: {
                    messages: []
                }
            }
        })
        return
    }
    
    this.context.serverHandler.send({
        type: "syncResponseShallow",
        data: {
            syncBody: syncBody.packet,
            changes: newChanges,
        }
    })
}

export async function handleSyncResponseMessages(this: ServerHandler, message: WSMessage) {
    if (message.type !== "syncResponseMessages") {
        return
    }

    const changes = message.data.changes.messages

    let newChanges: SyncChangesMessages | undefined;
    let syncBody: MessagesSyncBody | undefined;

    await db.transaction("rw", [db.users, db.chats, db.messages], async () => {
        for (const message of changes) {
            const local = await db.messages.get(message.id)
            if (!local) {
                const temp = await db.messages.where("tempId").equals(message.tempId).first()
                if (!temp) {
                    await db.messages.add(message)
                    continue
                }
                await db.messages.put(message)
                continue
            }
            if (local.lastUpdated > message.lastUpdated) {
                continue
            }
            await db.messages.put(message)
        }

        const incoming = message.data.syncBody
        syncBody = await this.context.syncManager.makeMessagesSyncBody(Object.keys(incoming.chats).map(Number))

        newChanges = await generateChangesMessages(syncBody, incoming)
    })

    if (newChanges && newChanges.messages.length === 0) {
        return
    }

    if (!newChanges || !syncBody) {
        throw new Error("neshto utna negde")
    }

    this.context.serverHandler.send({
        type: "syncResponseMessages",
        data: {
            syncBody: {
                chats: Object.fromEntries(syncBody.packet.chats.map(chat => [chat.id, chat.tree])),
            },
            changes: newChanges,
        }
    })
}
