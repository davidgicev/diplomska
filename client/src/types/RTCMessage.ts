export type RTCMessage = {
    type: "newMessage",
    data: Store.Message
} | {
    type: "newChat",
    data: Store.Chat
} | {
    type: "typingEvent",
    data: {
        chatId: string | number
        fromUserId: number
    }
}