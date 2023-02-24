declare namespace Store {
    interface User {
        id: number
        username?: string
        firstName?: string
        lastName?: string
        photo?: string
    }

    interface Message {
        id: string
        tempId: string
        chatId: string
        tempChatId: string
        fromUserId: number
        date: number
        content: string
    }

    type Chat = {
        id: string
        tempId: string
        type: "private" | "group"
        userIds: number[]
        title?: string
        photo?: string
    }

    type Actions = import("./actions").Actions
    
    interface Context {
        client: {
            serverConnectionStatus: "connected" | "offline"
        }
        activeChatId?: string
        users: Record<string, User>
        chats: Record<string, Chat>
        messages: Record<string, Message>
        actions: { [K in keyof Actions]: OmitThisParameter<Actions[K]> }
    }
}