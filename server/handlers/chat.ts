import Chat from "../types/chat"
import Server from "../Server"

export function updateChat(server: Server, chat: Chat) {
    const {
        id,
        userIds
    } = chat

    // server.db.createMessage({from_user, to_user, content})
    server.db.updateChat(chat)
    // console.log("pravam nov chat uwu", chat)
    const connections = server.ws.users
    for (const userId of userIds) {
        const connection = connections[userId]
        server.ws.sendTo(connection, {
            type: "newChat",
            data: {
                id,
                userIds,
                title: "",
                photo: "",
            }
        })

    }
}