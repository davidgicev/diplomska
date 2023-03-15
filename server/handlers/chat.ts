import Chat from "../types/chat"
import Server from "../server"

export async function updateChat(server: Server, chat: Chat) {
    const {
        userIds,
        tempId
    } = chat

    // server.db.createMessage({from_user, to_user, content})
    const id = await server.db.updateChat(chat)
    // console.log("pravam nov chat uwu", chat)
    const connections = server.ws.users
    for (const userId of userIds) {
        const connection = connections[userId]
        server.ws.sendTo(connection, {
            type: "upsertChat",
            data: {
                id,
                userIds,
                tempId,
                title: "",
                photo: "",
            }
        })

    }
}