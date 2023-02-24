import User from "../types/user"
import { DBContext } from "./"

export async function updateUser(this: DBContext, user: User): Promise<number | undefined> {
    return await this.db.transaction(async (t) => {
        const [ existingUser ] = await t("users").where({ id: user.id }).select("*")
        if (existingUser !== undefined) {
            return
        }
        const userToInsert = { ...user }
        delete userToInsert.id
        const [ result ] = await t("users").insert(userToInsert)
        return result
    })    
}

export async function getUsers(this: DBContext) {
    return await this.db("users").select("*")
}
