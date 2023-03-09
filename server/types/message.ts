export default class Message {
    id: string | number
    tempId: string
    chatId: string | number
    tempChatId: string
    content: string
    fromUserId: number
    date: number
    lastUpdated: number
    deleted: 0 | 1
}
