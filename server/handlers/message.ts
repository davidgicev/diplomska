import Message from "../types/message"
import Server from "../Server"

export async function updateMessage(server: Server, message: Message) {
    const {
        id,
        chatId,
        tempId,
    } = message

    let newId = id

    if (id === tempId) {
        newId = await server.db.updateMessage(message)
    }

    const userIds: number[] = (await server.db.db("usersChats").where({ chatId }).select('userId')).map(r => r.userId)

    const connections = server.ws.users
    for (const userId of userIds) {
        if (!(userId in connections)) {
            return
        }
        const connection = connections[userId]
        server.ws.sendTo(connection, {
            type: "upsertMessage",
            data: {
                ...message,
                id: newId !== undefined ? newId : id,
                tempId,
                chatId,
            }
        })

    }

}
