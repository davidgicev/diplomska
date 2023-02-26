declare namespace Store {
    interface User {
        id: number
        username: string
        firstName: string
        lastName: string
        photo: string
        lastUpdated: number
    }

    interface Message {
        id: string
        tempId: string
        chatId: string
        tempChatId: string
        fromUserId: number
        date: number
        content: string
        lastUpdated: number
    }

    type Chat = {
        id: string
        tempId: string
        type: "private" | "group"
        userIds: number[]
        title: string
        photo: string
        lastUpdated: number
    }

    interface UserState {
        id: number
        connected: boolean
    }

    type Actions = import("./actions").Actions
    
    interface Context {
        client: {
            serverConnectionStatus: "connected" | "offline",
            users: Record<number, UserState>
        }
        activeChatId?: string
        users: Record<string, User>
        chats: Record<string, Chat>
        messages: Record<string, Message>
        actions: { [K in keyof Actions]: OmitThisParameter<Actions[K]> }
    }
}