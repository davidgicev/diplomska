export type RTCMessage = {
    type: "newMessage",
    data: Store.Message
} | {
    type: "newChat",
    data: Store.Chat
}