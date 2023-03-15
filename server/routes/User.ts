import { Request, Response } from "express"
import User from "../types/user"
import Server from "../server"
import { initializeUser } from "../handlers/user"

export function addUserRoute(server: Server) {
    server.app.post("/api/registerUser", async (req: Request, res: Response): Promise<void> => {
        const user: User = req.body

        const generatedId = await initializeUser(server, user)
        res.send({
            id: generatedId,
            token: generatedId,
        })
    })

    server.app.get("/api/users", async (req: Request, res: Response<User[]>): Promise<void> => {
        const data = await server.db.getUsers()
        res.send(data)
    })

    server.app.put("/api/users/sync", async (req: Request, res: Response<User[]>): Promise<void> => {
        const data = await server.db.getUsers()
        res.send(data)
    })
}