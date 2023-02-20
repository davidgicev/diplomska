declare namespace View {
    interface User {
        id: string
        username?: string
        firstName?: string
        lastName?: string
        photo?: string
    }

    interface Message {
        id: string
        chatId: string
        user: User
        date: Date
        content: string
    }

    type Chat = {
        id: string
        type: "private" | "group"
        users: User[]
        title?: string
        photo?: string
        messages: Record<string, Message>
    } 
}