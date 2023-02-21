declare namespace Store {
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
        fromUserId: string
        date: number
        content: string
        tempId: string
    }

    type Chat = {
        id: string
        tempId: string
        type: "private" | "group"
        userIds: string[]
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