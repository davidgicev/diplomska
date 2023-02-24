export type WSMessage = {
    type: "loginRequest",
    data: {
        id: number,
        token: string
    }
} | {
    type: "loginResponse",
    data: {
        success: false
    } | {
        success: true
        userIds: number[]
    }
} | {
    type: "candidate",
    data: {
        targetUserId: number
        candidate: RTCIceCandidate
    }
} | {
    type: "offer",
    data: {
        targetUserId: number
        SDU: RTCSessionDescriptionInit
    }
} | {
    type: "answer",
    data: {
        targetUserId: number
        SDU: RTCSessionDescriptionInit
    }
} | {
    type: "upsertUser",
    data: {
        id: number
        username: string
    }
} | {
    type: "upsertChat",
    data: {
        id: string
        tempId: string
        title: string
        photo: string
        userIds: number[]
    }
} | {
    type: "upsertMessage",
    data: {
        id: string
        tempId: string
        chatId: string
        tempChatId: string
        fromUserId: number
        content: string
        date: number
    }
} | {
    type: "userLeft",
    data: {
        id: number
    }
} | {
    type: "error",
    data: {
        message: string
    }
}
