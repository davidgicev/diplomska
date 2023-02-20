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
        candidate: RTCIceCandidate
    }
} | {
    type: "offer",
    data: {
        targetUserId: string
        SDU: RTCSessionDescriptionInit
    }
} | {
    type: "answer",
    data: {
        targetUserId: string
        SDU: RTCSessionDescriptionInit
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
        chatId: string
        content: string
        date: number
        fromUserId: string
        tempId: string
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
