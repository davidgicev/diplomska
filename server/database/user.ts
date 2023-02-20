import User from "../types/user"
import { DBContext } from "./"

export default function attachMessageHandlers(this: DBContext) {
    this.updateUser = (user: User): void => {
        // console.log(user)
        // this.db.run(`
        //     INSERT INTO user (name)
        //     VALUES (?)
        // `, user.name)
        if (user.id in this.fakeDB.users) {
            this.fakeDB.users = {
                ...this.fakeDB.users,
                [user.id]: {
                    ...this.fakeDB.users[user.id],
                    ...user,
                }
            }
        }
        else {
            this.fakeDB.users = {
                ...this.fakeDB.users,
                [user.id]: user
            }
        }
    }

    this.getUsers = async () => {
        // const result = await this.db.all<User[]>(`
        //     SELECT * FROM user
        // `)
        return Object.values(this.fakeDB.users)
    }
}
