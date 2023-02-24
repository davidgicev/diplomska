"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const message_1 = require("./handlers/message");
const user_1 = require("./handlers/user");
class WebSocketServer {
    constructor(context) {
        this.context = context;
        const server = new ws_1.WebSocketServer({ port: 9000 });
        this.server = server;
        this.users = {};
        server.on('connection', (connection, request) => {
            console.log("User connected", request.url);
            const userId = Number(request.url.substring(1));
            connection.on("close", () => {
                delete this.users[userId];
                for (const id in this.users) {
                    const connection = this.users[id];
                    this.sendTo(connection, {
                        type: "userLeft",
                        data: {
                            id: userId,
                        }
                    });
                }
            });
            connection.on('message', (message) => {
                let body;
                try {
                    body = JSON.parse(message.toString());
                }
                catch (e) {
                    console.log("Invalid JSON");
                    return;
                }
                switch (body.type) {
                    case "loginRequest": {
                        console.log("User logged", body.data.id);
                        const userId = body.data.id;
                        if (this.users[userId]) {
                            this.sendTo(connection, {
                                type: "loginResponse",
                                data: {
                                    success: false
                                }
                            });
                        }
                        else {
                            this.sendTo(connection, {
                                type: "loginResponse",
                                data: {
                                    success: true,
                                    userIds: Object.keys(this.users).map(k => Number(k)),
                                    username: body.data.username
                                }
                            });
                            this.users[userId] = connection;
                            console.log(body.data);
                            (0, user_1.updateUser)(this.context, {
                                id: userId,
                                username: body.data.username,
                            });
                        }
                        break;
                    }
                    case "offer": {
                        console.log("Sending offer to: ", body.data.targetUserId);
                        const conn = this.users[body.data.targetUserId];
                        if (conn != null) {
                            this.sendTo(conn, {
                                type: "offer",
                                data: {
                                    targetUserId: userId,
                                    SDU: body.data.SDU,
                                }
                            });
                        }
                        break;
                    }
                    case "answer": {
                        console.log("Sending answer to: ", body.data.targetUserId);
                        var conn = this.users[body.data.targetUserId];
                        if (conn != null) {
                            this.sendTo(conn, {
                                type: "answer",
                                data: {
                                    targetUserId: userId,
                                    SDU: body.data.SDU,
                                }
                            });
                        }
                        break;
                    }
                    case "candidate": {
                        console.log("Sending candidate to:", body.data.targetUserId);
                        const conn = this.users[body.data.targetUserId];
                        if (conn != null) {
                            this.sendTo(conn, {
                                type: "candidate",
                                data: {
                                    targetUserId: userId,
                                    candidate: body.data.candidate,
                                }
                            });
                        }
                        break;
                    }
                    case "upsertMessage": {
                        const message = body.data;
                        (0, message_1.updateMessage)(this.context, message);
                        break;
                    }
                    default:
                        this.sendTo(connection, {
                            type: "error",
                            data: {
                                message: "Command not found: " + body.type
                            }
                        });
                        break;
                }
            });
            connection.on("close", () => {
                if (!userId) {
                    return;
                }
                delete this.users[userId];
                for (const id in this.users) {
                    const connection = this.users[id];
                    if (connection) {
                        this.sendTo(connection, {
                            type: "userLeft",
                            data: { id: userId }
                        });
                    }
                }
            });
        });
    }
    sendTo(connection, message) {
        connection.send(JSON.stringify(message));
    }
}
exports.default = WebSocketServer;
