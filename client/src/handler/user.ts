import { db } from "../database";

export async function updateUser(user: Store.User) {
    await db.users.put(user)
}