import MerkleTree from "merkletreejs"
import { User, Chat, Message } from "./protocolObjectTypes"

/*




*/

export type ShallowSyncBody = {
    packet: ShallowSyncBodyMessage,
    trees: {
        users: MerkleTree
        chats: MerkleTree
        messages: MerkleTree    
    }
}

export type ShallowSyncBodyMessage = {
    users: MTHash
    chats: MTHash
    // really means shallow chats
    messages: MTHash
}

export type MessagesSyncBody = {
    trees: {
        chats: { id: number, tree: MerkleTree }[]
    }
    packet: {
        chats: { id: number, tree: MTHash }[]
    }
}

export type MessagesSyncBodyMessage = {
    // for some chats only
    chats: Record<number, MTHash>
}


export type SyncChanges = {
    users: User[]
    chats: Chat[]
}

export type SyncChangesInternal = {
    users: User[]
    chats: Chat[]
    messageChangedInChatIds: number[] | null
}

export type SyncChangesMessages = {
    messages: Message[]
}

export interface MTHash {
    [index: string]: MTHash
}

export type SPMessage = 

{
    type: "syncResponseShallow",
    data: {
        syncBody: ShallowSyncBodyMessage,
        changes: SyncChanges,
    }
} | {
    type: "syncResponseMessages",
    data: {
        syncBody: MessagesSyncBodyMessage,
        changes: SyncChangesMessages
    }
}