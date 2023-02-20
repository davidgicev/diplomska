import User from "../types/user"
import Server from "../Server"
import { updateChat } from "./chat"

export function updateUser(server: Server, user: User) {
    server.db.updateUser(user)
    // console.log("pravam nov user uwu", user)
    const connections = server.ws.users
    const newUserId = user.id
    for (const userId in connections) {
        const connection = connections[userId]
        server.ws.sendTo(connection, {
            type: "newUser",
            data: {
                id: newUserId,
            }
        })
    }

    for (const userId in connections) {
        updateChat(server, {
            id: [newUserId, userId].sort().join(";"),
            title: "",
            type: "private",
            userIds: newUserId === userId ? [userId] : [newUserId, userId]
        })
    }

}