import User from "../../types/user"
import { DBContext } from "./"

export default function attachMessageHandlers(this: DBContext) {
    this.createUser = (user: Omit<User, "id">): void => {
        console.log(user)
        this.db.run(`
            INSERT INTO user (name)
            VALUES (?)
        `, user.name)
    }

    this.getUsers = async () => {
        const result = await this.db.all<User[]>(`
            SELECT * FROM user
        `)
        return result
    }
}
