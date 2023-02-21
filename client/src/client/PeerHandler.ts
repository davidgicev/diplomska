import { RTCMessage } from "../types/RTCMessage";
import WebSocketClient from "./WebSockerClient";

export default class ServerHandler {
    context: WebSocketClient
    
    channel: RTCDataChannel
    
    constructor(context: WebSocketClient, channel: RTCDataChannel, id: string) {
        this.context = context
        this.channel = channel

        channel.onopen = () => {
            console.log("Opened channel")
        }

        channel.onmessage = ({ data }) => {
            console.log("RTC message primeno", data)
            const message: RTCMessage = JSON.parse(data)
            this.handlers[message.type](message)
        }

        channel.onclose = (event) => {
            alert("Gasam konekcija uwu "+id)
            delete this.context.peerConnections[id]
            delete this.context.dataChannels[id]
        }
    }

    handlers = {
        newMessage: this.handleNewMessage.bind(this),
    }

    handleNewMessage(message: RTCMessage) {
        if (message.type !== "newMessage") {
            return
        }

        this.context.context.state.actions.addNewMessage(message.data)
    }
}