import cors from "cors"
import express, { Express, Request, Response } from "express"
import path from "path"
import { DBContext } from "./database"
import { addMessageRoute } from "./routes/Message"
import { addUserRoute } from "./routes/User"
import { addChatRoute } from "./routes/Chat"
import bodyParser from "body-parser"
import WebSocketServer from "./WebSocketServer"
import { SyncManager } from "./syncing"

export default class Server {
    ws: WebSocketServer
    app: Express
    db: DBContext

    constructor(app: Express) {
        this.app = app

        this.db = new DBContext()

        this.ws = new WebSocketServer(this)

        this.app.use(cors())
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())

        this.app.use(express.static(path.resolve("./") + "/client/build"));

        this.app.get("/api", (req: Request, res: Response): void => {
            res.send("api endpoint")
        })

        addMessageRoute(this)
        addUserRoute(this)
        addChatRoute(this)

        this.app.get("*", (req: Request, res: Response): void => {
            res.sendFile(path.resolve("./") + "/client/build/index.html");
        })

    }

    start(port = 5000): void {
        this.app.listen(port, () => {
            console.log("Server is listening on port "+port)
        })
    }
}