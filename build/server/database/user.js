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
exports.getUsers = exports.updateUser = void 0;
function updateUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.db.transaction((t) => __awaiter(this, void 0, void 0, function* () {
            const [existingUser] = yield t("users").where({ username: user.username }).select("*");
            if (existingUser !== undefined) {
                yield t("users").where({ id: existingUser.id }).update(Object.assign(Object.assign({}, user), { id: existingUser.id, lastUpdated: existingUser.lastUpdated + 1 }));
                return existingUser.id;
            }
            const userToInsert = Object.assign({}, user);
            delete userToInsert.id;
            const [result] = yield t("users").insert(userToInsert);
            return result;
        }));
    });
}
exports.updateUser = updateUser;
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.db("users").select("*");
    });
}
exports.getUsers = getUsers;
