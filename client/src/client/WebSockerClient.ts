import { StoreProvider } from "../store/StoreProvider"
import { SyncManager } from "../syncing/manager"
import { RTCMessage } from "../types/RTCMessage"
import ServerHandler from "./ServerHandler"

export default class WebSocketClient {
    context: StoreProvider
    user: AuthStore.User
    
    serverHandler: ServerHandler
    syncManager: SyncManager

    peerConnections: Record<string, RTCPeerConnection> = {}
    dataChannels: Record<string, RTCDataChannel> = {}

    constructor(context: StoreProvider, user: AuthStore.User) {
        this.context = context
        this.user = user
        this.serverHandler = new ServerHandler(this)
        this.syncManager = new SyncManager()
    }

    sendMessage(targetUserId: number, message: Store.Message) {
        if (targetUserId === this.user.id) {
            return
        }
        console.log("probuvam da pratam poraka do", targetUserId, "porakata e", message)
        console.log(this.dataChannels[targetUserId])
        if (!this.dataChannels[targetUserId]) {
            return
        }
        const channel = this.dataChannels[targetUserId]
        const data: RTCMessage = {
            type: "newMessage",
            data: message
        }
        channel.send(JSON.stringify(data))
    }

    sendChat(targetUserId: number, chat: Store.Chat) {
        if (targetUserId === this.user.id) {
            return
        }
        console.log("probuvam da pratam poraka do", targetUserId, "porakata e", chat)
        console.log(this.dataChannels[targetUserId])
        if (!this.dataChannels[targetUserId]) {
            return
        }
        const channel = this.dataChannels[targetUserId]
        const data: RTCMessage = {
            type: "newChat",
            data: chat
        }
        channel.send(JSON.stringify(data))
    }

    sendTypingEvent(targetUserId: number, chatId: string | number, userId: number) {
        if (targetUserId === this.user.id) {
            return
        }
        if (!this.dataChannels[targetUserId]) {
            return
        }
        const channel = this.dataChannels[targetUserId]
        const data: RTCMessage = {
            type: "typingEvent",
            data: {
                chatId,
                fromUserId: userId,
            }
        }
        channel.send(JSON.stringify(data))
    }
}