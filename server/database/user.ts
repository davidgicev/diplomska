import User from "../types/user"
import { DBContext } from "./"

export async function updateUser(this: DBContext, user: User): Promise<number | undefined> {
    return await this.db.transaction(async (t) => {
        const [ existingUser ] = await t("users").where({ username: user.username }).select("*")
        if (existingUser !== undefined) {
            await t("users").where({ id: existingUser.id }).update({...user, id: existingUser.id, lastUpdated: existingUser.lastUpdated + 1 })
            return existingUser.id
        }
        const userToInsert = { ...user }
        delete userToInsert.id
        const [ result ] = await t("users").insert(userToInsert)
        return result
    })    
}

export async function getUsers(this: DBContext): Promise<User[]> {
    return await this.db("users").select("*")
}
