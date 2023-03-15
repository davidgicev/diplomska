"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessageRoute = void 0;
function addMessageRoute(server) {
    server.app.post("/api/newMessage", (req, res) => {
        const { id, chatId, content, date, fromUserId, tempId, tempChatId, deleted, lastUpdated, } = req.body;
        server.db.updateMessage({ chatId, id, content, date, fromUserId, tempId, tempChatId, deleted, lastUpdated });
        res.sendStatus(200);
    });
    server.app.get("/api/messages", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const data = yield server.db.getMessages();
        res.send(data);
    }));
    server.app.get("/api/getChatMessages", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const data = yield server.db.getMessages();
        const { chatId } = req.query;
        res.send(Object.fromEntries((yield server.db.getMessages()).filter((m) => m.chatId === chatId).map((m) => [m.id, m])));
    }));
}
exports.addMessageRoute = addMessageRoute;
