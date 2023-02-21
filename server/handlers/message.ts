import Message from "../types/message"
import Server from "../Server"

export function updateMessage(server: Server, message: Message) {
    const {
        id,
        chatId,
    } = message

    const tempId = id.startsWith("temp") ? id : undefined
    const newId = server.db.updateMessage(message)
    console.log(server.db.fakeDB.chats)
    const { userIds } = server.db.fakeDB.chats[chatId]

    const connections = server.ws.users
    for (const userId of userIds) {
        if (!(userId in connections)) {
            return
        }
        const connection = connections[userId]
        server.ws.sendTo(connection, {
            type: "newMessage",
            data: {
                ...message,
                id: newId ? newId : id,
                tempId,
            }
        })

    }

}
