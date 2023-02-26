import { SPMessage } from "../../../syncing/protocolMessageTypes"

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
} 

| 

{
    type: "upsertUser",
    data: {
        id: number
    }
} | {
    type: "upsertChat",
    data: {
        id: string | number
        tempId: string
        title: string
        photo: string
        userIds: number[]
        lastUpdated: number
    }
} | {
    type: "upsertMessage",
    data: {
        id: string | number
        tempId: string
        chatId: string | number
        tempChatId: string
        fromUserId: number
        content: string
        date: number
        lastUpdated: number
    }
} | {
    type: "userLeft",
    data: {
        id: number
    }
} 

| SPMessage

| {
    type: "error",
    data: {
        message: string
    }
}
