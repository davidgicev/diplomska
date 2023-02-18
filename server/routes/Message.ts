import { Request, Response } from "express"
import Server from "server/Server"
import Message from "../../types/message"

export function addMessageRoute(server: Server) {
    server.app.post("/api/newMessage", (req: Request, res: Response<void>): void => {
        const {
            from_user, 
            to_user,
            content
        }: Message = req.body

        server.db.createMessage({from_user, to_user, content})
        res.sendStatus(200)
    })

    server.app.get("/api/messages", async (req: Request, res: Response<Message[]>): Promise<void> => {
        const data = await server.db.getMessages()
        res.send(data)
    })
}