import { updateChat } from "../handler/chat"
import { updateMessage } from "../handler/message"
import { updateUser } from "../handler/user"
import { StoreProvider } from "./StoreProvider"

export const actions = {

    addUserConnection(this: StoreProvider, userId: number) {
        this.setState((state) => ({
            client: {
                ...state.client,
                users: {
                    ...state.client.users,
                    [userId]: {
                        ...state.client.users[userId],
                        connected: true,
                    }
                }
            }
        }))
    },

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

    setActiveChatId(this: StoreProvider, activeChatId: string | number) {
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

    sendMessage(this: StoreProvider, message: Store.Message, userIds: number[]) {
        console.log("Store: Sending new message", message)
        this.state.actions.upsertMessage(message)
        this.client?.serverHandler.send({
            type: "upsertMessage",
            data: message
        })
        for (const id of userIds) {
            this.client?.sendMessage(id, message)
        }
    },

    async syncWithServer(this: StoreProvider) {

        const syncBody = await this.client?.syncManager.makeShallowSyncBody()

        if (!syncBody) {
            return
        }

        syncBody && this.client?.serverHandler.send({
            type: "syncResponseShallow",
            data: {
                syncBody: syncBody.packet,
                changes: {
                    chats: [],
                    users: []
                }
            }
        })
    },

    async createNewChat(this: StoreProvider) {
        const title = prompt("Enter name for new chat", "")
        const userIdsString = prompt("Enter userIds for new chat separated by comma", "")

        if (!title || !userIdsString) {
            return
        }

        const userIds = userIdsString.split(",").map(s => Number(s.trim()))

        const id = "temp#" + Date.now().toString()

        const chat: Store.Chat = {
            id,
            tempId: id,
            lastUpdated: 0,
            photo: "",
            title,
            type: "group",
            userIds,
        }

        this.state.actions.upsertChat(chat)
        this.client?.serverHandler.send({
            type: "upsertChat",
            data: chat
        })
        for (const id of userIds) {
            this.client?.sendChat(id, chat)
        }        

    }
}

export type Actions = typeof actions