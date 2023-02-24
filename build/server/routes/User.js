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
function addUserRoute(server) {
    server.app.post("/api/newUser", (req, res) => {
        const { username, id } = req.body;
        server.db.updateUser({ username, id });
        res.sendStatus(200);
        // res.send(req)
    });
    server.app.get("/api/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const data = yield server.db.getUsers();
        res.send(data);
    }));
}
exports.addUserRoute = addUserRoute;
