import { Knex } from "knex"

declare module 'knex/types/tables' {
    interface User {
        id: number
        username: string
    }

    interface Chat {
        id: number
        title: string
        photo: string
    }

    interface Tables {
        users: User
        chats: Chat
    }
}