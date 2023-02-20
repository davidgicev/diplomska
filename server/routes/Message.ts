import { Request, Response } from "express"
import Server from "server/Server"
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
        }: Message = req.body

        server.db.updateMessage({chatId, id, content, date, fromUserId, tempId})
        res.sendStatus(200)
    })

    server.app.get("/api/messages", async (req: Request, res: Response<Message[]>): Promise<void> => {
        const data = await server.db.getMessages()
        res.send(data)
    })
}