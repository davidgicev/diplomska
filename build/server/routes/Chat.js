"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChatRoute = void 0;
const chat_1 = require("../handlers/chat");
function addChatRoute(server) {
    server.app.post("/api/newChat", (req, res) => {
        (0, chat_1.updateChat)(server, req.body);
        res.sendStatus(200);
    });
    // server.app.get("/api/messages", async (req: Request, res: Response<Message[]>): Promise<void> => {
    //     const data = await server.db.getMessages()
    //     res.send(data)
    // })
}
exports.addChatRoute = addChatRoute;
