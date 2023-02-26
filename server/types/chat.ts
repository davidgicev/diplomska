export default class Chat {
    id: string | number
    tempId: string
    userIds: number[]
    title: string
    type: "private" | "group"
}
