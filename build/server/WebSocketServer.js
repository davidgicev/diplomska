"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const message_1 = require("./handlers/message");
const user_1 = require("./handlers/user");
const syncing_1 = require("./syncing");
class WebSocketServer {
    constructor(context) {
        this.context = context;
        const server = new ws_1.WebSocketServer({ port: 9000 });
        this.server = server;
        this.syncer = new syncing_1.SyncManager(this);
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
                            delete this.users[userId];
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
                                }
                            });
                            this.users[userId] = connection;
                            console.log(body.data);
                            (0, user_1.userLoggedIn)(this.context, body.data.id);
                            // tuka naprai sync yes yes
                            // console.log(this.context.syncer.makeSyncMessage(body.data.id))
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
                    case "syncResponseShallow": {
                        this.syncer.handleSyncResponseShallow(body, userId);
                        break;
                    }
                    case "syncResponseMessages": {
                        this.syncer.handleSyncResponseMessages(body, userId);
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
        try {
            connection.send(JSON.stringify(message));
        }
        catch (e) { }
    }
}
exports.default = WebSocketServer;
