import { StoreProvider } from "../store/StoreProvider"
import { RTCMessage } from "../types/RTCMessage"
import ServerHandler from "./ServerHandler"

export default class WebSocketClient {
    context: StoreProvider
    userId: string
    
    serverHandler: ServerHandler

    peerConnections: Record<string, RTCPeerConnection> = {}
    dataChannels: Record<string, RTCDataChannel> = {}

    constructor(context: StoreProvider, userId: string) {
        this.context = context
        this.userId = userId
        this.serverHandler = new ServerHandler(this)
    }

    sendMessage(targetUserId: string, message: Store.Message) {
        if (targetUserId === this.userId) {
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
}