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
        id: string | number
        tempId: string
        chatId: string | number
        tempChatId: string
        fromUserId: number
        date: number
        content: string
        lastUpdated: number
    }

    type Chat = {
        id: string | number
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

    interface ChatState {
        typingUserIds: Record<number, true>
    }

    type Actions = import("./actions").Actions
    
    interface Context {
        client: {
            serverConnectionStatus: "connected" | "offline",
            users: Record<number, UserState>
            chats: Record<string | number, ChatState>
        }
        activeChatId?: string | number
        users: Record<string, User>
        chats: Record<string, Chat>
        messages: Record<string, Message>
        actions: { [K in keyof Actions]: OmitThisParameter<Actions[K]> }
    }
}