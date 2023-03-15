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
exports.addUserRoute = void 0;
const user_1 = require("../handlers/user");
function addUserRoute(server) {
    server.app.post("/api/registerUser", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        const generatedId = yield (0, user_1.initializeUser)(server, user);
        res.send({
            id: generatedId,
            token: generatedId,
        });
    }));
    server.app.get("/api/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const data = yield server.db.getUsers();
        res.send(data);
    }));
    server.app.put("/api/users/sync", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const data = yield server.db.getUsers();
        res.send(data);
    }));
}
exports.addUserRoute = addUserRoute;
