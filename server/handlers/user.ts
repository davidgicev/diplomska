import User from "../types/user"
import Server from "../Server"
import { updateChat } from "./chat"
import Chat from "server/types/chat"

export async function updateUser(server: Server, user: User) {
    const connections = server.ws.users
    const newUserId = (await server.db.updateUser(user)) ?? user.id
    for (const userId in connections) {
        const connection = connections[userId]
        server.ws.sendTo(connection, {
            type: "upsertUser",
            data: {
                id: newUserId,
            }
        })
    }

    {
        // check if new user has chat with self
        const existingPrivateChatId = (await server.db.db.raw(`
                                            SELECT * from usersChats
                                            JOIN chats on usersChats.chatId = chats.id
                                            WHERE type = 'private' AND usersChats.userId = ?
                                            GROUP BY usersChats.chatId
                                            HAVING COUNT(*) = 1
                                        `, [newUserId]))[0]?.chatId
        
        if (existingPrivateChatId === undefined) {
            updateChat(server, {
                id: "",
                title: "",
                type: "private",
                userIds: [newUserId],
                tempId: "",
            })
        }
        else {
            // ova ke ne treba vo idnina
            const [ existingChat ] = await server.db.db("chats").where({ id: existingPrivateChatId }).select("*")
            server.ws.sendTo(server.ws.users[newUserId], {
                type: "upsertChat",
                data: existingChat,
            })
        }
    }



    for (const userId in connections) {
        const userIdAsNumber = Number(userId)
        if (userIdAsNumber === newUserId) {
            continue
        }
        const existingPrivateChatId = (await server.db.db.raw(`
                                            SELECT * from usersChats
                                            JOIN chats on usersChats.chatId = chats.id
                                            WHERE type = 'private' AND
                                            (usersChats.userId = ? OR usersChats.userId = ? )
                                            GROUP BY usersChats.chatId
                                            HAVING COUNT(*) = 2
                                        `, [userIdAsNumber, newUserId]))[0]?.chatId

        if (existingPrivateChatId === undefined) {
            updateChat(server, {
                id: "",
                title: "",
                type: "private",
                userIds: newUserId === userIdAsNumber ? [userIdAsNumber] : [newUserId, userIdAsNumber],
                tempId: "",
            })
        }
        else {
            const [ existingChat ] = await server.db.db("chats").where({ id: existingPrivateChatId }).select("*")
            const userIds = (await server.db.db("usersChats").where({ chatId: existingPrivateChatId }).select("userId")).map(r => r.userId)
            const connections = server.ws.users
            for (const userId of userIds) {
                const connection = connections[userId]
                server.ws.sendTo(connection, {
                    type: "upsertChat",
                    data: {
                        ...existingChat,
                        userIds,
                    }
                })

            }
        }
        
    }

}