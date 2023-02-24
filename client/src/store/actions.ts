import { syncChats } from "../api/sync/chats"
import { syncMessages } from "../api/sync/messages"
import { syncUsers } from "../api/sync/users"
import { updateChat } from "../handler/chat"
import { updateMessage } from "../handler/message"
import { updateUser } from "../handler/user"
import { StoreProvider } from "./StoreProvider"

export const actions = {
    upsertUser(this: StoreProvider, user: Store.User) {
        console.log("Store: adding new user", user)
        // this.setState((state) => ({
        //     users: {
        //         ...state.users,
        //         [user.id]: user,
        //     },
        // }))
        updateUser(user)
    },

    async upsertChat(this: StoreProvider, chat: Store.Chat) {
        console.log("Store: adding new chat", chat)

        // this.setState((state) => {
        //     return {
        //         chats: {
        //             ...state.chats,
        //             [chat.id]: chat
        //         }
        //     }
        // })

        updateChat(chat)

        // const messages = await getChatMessages(chat.id)
        // for (const messageId in messages) {
        //     this.state.actions.addNewMessage(messages[messageId])
        // }
    },

    setActiveChatId(this: StoreProvider, activeChatId: string) {
        this.setState({ activeChatId })
    },

    upsertMessage(this: StoreProvider, message: Store.Message) {
        this.setState((state) => {
            const newMessages = { ...state.messages }

            if (message.id !== message.tempId) {
                delete newMessages[message.tempId]
            }
            newMessages[message.id] = message

            // return {
            //     ...state,
            //     messages: newMessages,
            // }
            updateMessage(message)
        })
    },

    sendMessage(this: StoreProvider, message: Store.Message, chatUserIds: number[]) {
        console.log("Store: Sending new message", message)
        this.state.actions.upsertMessage(message)
        this.client?.serverHandler.send({
            type: "upsertMessage",
            data: message
        })
        for (const id of chatUserIds) {
            this.client?.sendMessage(id, message)
        }
    },

    async syncUsers(this: StoreProvider) {
        const users = await syncUsers()
        for (const user of users) {
            this.state.actions.upsertUser(user)
        }
    },
    
    async syncChats(this: StoreProvider) {
        const chats = await syncChats()
        for (const chat of chats) {
            this.state.actions.upsertChat(chat)
        }
    },

    async syncMessages(this: StoreProvider) {
        const messages = await syncMessages()
        for (const message of messages) {
            this.state.actions.upsertMessage(message)
        }
    }
}

export type Actions = typeof actions