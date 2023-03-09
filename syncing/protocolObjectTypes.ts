export type Chat = {
    id: string | number
    tempId: string
    userIds: number[]
    type: "private" | "group"
    title: string
    photo: string
    lastUpdated: number
}

export type User = {
    id: number
    username: string
    firstName: string
    lastName: string
    photo: string
    lastUpdated: number
}

export type Message = {
    id: string | number
    tempId: string
    chatId: string | number
    tempChatId: string
    fromUserId: number
    date: number
    content: string
    lastUpdated: number
    deleted: 0 | 1
}