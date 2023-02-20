export type WSMessage = {
    type: "loginRequest",
    data: {
        id: string
    }
} | {
    type: "loginResponse",
    data: {
        success: false
    } | {
        success: true
        userIds: string[]
    }
} | {
    type: "candidate",
    data: {
        targetUserId: string
        candidate: string
    }
} | {
    type: "offer",
    data: {
        targetUserId: string
        SDU: string
    }
} | {
    type: "answer",
    data: {
        targetUserId: string
        SDU: string
    }
} | {
    type: "newUser",
    data: {
        id: string
    }
} | {
    type: "newChat",
    data: {
        id: string
        title: string
        photo: string
        userIds: string[]
    }
} | {
    type: "newMessage",
    data: {
        id: string
        tempId: string
        fromUserId: string
        chatId: string
        content: string
        date: number
    }
} | {
    type: "userLeft",
    data: {
        id: string
    }
} | {
    type: "error",
    data: {
        message: string
    }
}