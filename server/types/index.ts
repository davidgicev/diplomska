export interface Chat {
    id: string
    userIds: string[]
    title: string
    type: "private" | "group"
}