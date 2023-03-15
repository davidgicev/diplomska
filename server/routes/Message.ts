import { Request, Response } from "express"
import Server from "server/server"
import Message from "../types/message"

export function addMessageRoute(server: Server) {
    server.app.post("/api/newMessage", (req: Request, res: Response<void>): void => {
        const {
            id,
            chatId,
            content,
            date,
            fromUserId,
            tempId,
            tempChatId,
            deleted,
            lastUpdated,
        }: Message = req.body

        server.db.updateMessage({chatId, id, content, date, fromUserId, tempId, tempChatId, deleted, lastUpdated})
        res.sendStatus(200)
    })

    server.app.get("/api/messages", async (req: Request, res: Response<Message[]>): Promise<void> => {
        const data = await server.db.getMessages()
        res.send(data)
    })

    server.app.get("/api/getChatMessages", async (req: Request, res: Response): Promise<void> => {
        const data = await server.db.getMessages()
        const { chatId } = req.query
        res.send(
            Object.fromEntries((await server.db.getMessages()).filter((m) => m.chatId === chatId).map((m) => [m.id, m]))
        )
    })
}