export type Chat = {
    id: string
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
    id: string
    tempId: string
    chatId: string
    tempChatId: string
    fromUserId: number
    date: number
    content: string
    lastUpdated: number
}