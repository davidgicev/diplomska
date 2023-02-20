import { Request, Response } from "express"
import User from "../types/user"
import Server from "server/Server"

export function addUserRoute(server: Server) {
    server.app.post("/api/newUser", (req: Request, res: Response<void>): void => {
        const {
            name, id
        }: User = req.body

        server.db.updateUser({name, id})
        res.sendStatus(200)
        // res.send(req)
    })

    server.app.get("/api/users", async (req: Request, res: Response<User[]>): Promise<void> => {
        const data = await server.db.getUsers()
        res.send(data)
    })
}