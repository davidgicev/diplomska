import { SHA256 } from "crypto-js"
import MerkleTree from "merkletreejs"
import { MTHash, MessagesSyncBody, ShallowSyncBody } from "../syncing/protocolMessageTypes"
import { Chat, Message, User } from "./protocolObjectTypes"

type Difference = {
    type: "change",
    key: string
} | {
    type: "insertionLocal",
    key: string
} | {
    type: "insertionIncoming",
    key: string
}

export function findDifferenceBetweenShallow(current: MTHash, other: MTHash): Difference[] {
    if (!current && !other) {
        return []
    }
    const currentKeys = current ? Object.keys(current) : []
    const otherKeys = other ? Object.keys(other) : []

    const length = Math.min(currentKeys.length, otherKeys.length)

    const diffs: Difference[] = []

    for (let i=0; i<length; i++) {
        const currentKey = currentKeys[i]
        const otherKey = otherKeys[i]

        if (currentKey === otherKey) {
            continue
        }

        if (!current[currentKey] && !other[otherKey]) {
            diffs.push({ type: "change", key: currentKey })
            continue
        }

        diffs.push(...findDifferenceBetweenShallow(current[currentKey], other[otherKey]))
    }

    const isLocalLonger = currentKeys.length > otherKeys.length
    const longerObject = isLocalLonger ? current : other
    const longerArray = Object.keys(longerObject)

    for (let i = length; i<longerArray.length; i++) {
        const key = longerArray[i]
        if (!longerObject[key]) {
            diffs.push({ key, type: isLocalLonger ? "insertionLocal" : "insertionIncoming" })
            continue
        }
        diffs.push(...traverseToEnd(longerObject[key]).map((key): Difference => ({
            key,
            type: isLocalLonger ? "insertionLocal" : "insertionIncoming"
        })))
    }

    return diffs
}

export function traverseToEnd(node: MTHash): string[] {
    const diffs: string[] = []
    const keys = Object.keys(node)
    if (!keys.length) {
        return diffs
    }

    for (const key of keys) {
        if (!node[key]) {
            diffs.push(key)
            continue
        }
        diffs.push(...traverseToEnd(node[key]))
    }
    return diffs
}

export interface DBUtils {
    getUsers: () => Promise<User[]>
    getChats: () => Promise<Chat[]>
    getMessagesForChat: (id: number) => Promise<Message[]>
}

export async function makeShallowSyncBody(utils: DBUtils): Promise<ShallowSyncBody> {
    const users = await utils.getUsers()
    const hashedUsers = users.map(u => SHA256(JSON.stringify(u)))
    const usersObject = new MerkleTree(hashedUsers)

    const chats = await utils.getChats()
    const hashedChats = chats.map(c => SHA256(JSON.stringify(c)))
    const chatsObject = new MerkleTree(hashedChats)

    const hashedMessages = []
    for (const chat of chats) {
        const messages = await utils.getMessagesForChat(Number(chat.id))
        hashedMessages.push(SHA256(messages.map(m => SHA256(JSON.stringify(m))).join("")))
    }
    const messagesObject = new MerkleTree(hashedMessages)
    
    return {
        packet: {
            users: usersObject.getLayersAsObject(),
            chats: chatsObject.getLayersAsObject(),
            messages: messagesObject.getLayersAsObject()
        },
        trees: {
            users: usersObject,
            chats: chatsObject,
            messages: messagesObject
        },
    }
}

export async function makeMessagesSyncBody(utils: DBUtils, chatIds: number[]): Promise<MessagesSyncBody> {
    const chats: Record<number, MerkleTree> = {}
    for (const chatId of chatIds) {
        const chatIdAsNumber = Number(chatId)
        const messages = await utils.getMessagesForChat(chatIdAsNumber)
        const hashedMessages = messages.map(m => SHA256(JSON.stringify(m)))
        chats[chatIdAsNumber] = new MerkleTree(hashedMessages)
    }
    
    return {
        packet: {
            chats: Object.entries(chats).map(([id, tree]) => ({ id: Number(id), tree: tree.getLayersAsObject() }))
        },
        trees: {
            chats: Object.entries(chats).map(([id, tree]) => ({ id: Number(id), tree }))
        },
    }
}
