import { Request, Response } from "express"
import Server from "server/server"
import Chat from "../types/chat"
import { updateChat } from "../handlers/chat"

export function addChatRoute(server: Server) {
    server.app.post("/api/newChat", (req: Request, res: Response<void>): void => {
        updateChat(server, req.body as Chat)
        res.sendStatus(200)
    })

    // server.app.get("/api/messages", async (req: Request, res: Response<Message[]>): Promise<void> => {
    //     const data = await server.db.getMessages()
    //     res.send(data)
    // })
}