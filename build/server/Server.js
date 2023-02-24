"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const Message_1 = require("./routes/Message");
const User_1 = require("./routes/User");
const Chat_1 = require("./routes/Chat");
const body_parser_1 = __importDefault(require("body-parser"));
const WebSocketServer_1 = __importDefault(require("./WebSocketServer"));
class Server {
    constructor(app) {
        this.app = app;
        this.db = new database_1.DBContext();
        this.ws = new WebSocketServer_1.default(this);
        this.app.use((0, cors_1.default)());
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(body_parser_1.default.json());
        this.app.use(express_1.default.static(path_1.default.resolve("./") + "/client/build"));
        this.app.get("/api", (req, res) => {
            res.send("api endpoint");
        });
        (0, Message_1.addMessageRoute)(this);
        (0, User_1.addUserRoute)(this);
        (0, Chat_1.addChatRoute)(this);
        this.app.get("*", (req, res) => {
            res.sendFile(path_1.default.resolve("./") + "/client/build/index.html");
        });
    }
    start(port = 5000) {
        this.app.listen(port, () => {
            console.log("Server is listening on port " + port);
        });
    }
}
exports.default = Server;
