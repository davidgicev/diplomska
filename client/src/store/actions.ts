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

    sendMessage(this: StoreProvider, message: Store.Message) {
        console.log("Store: Sending new message", message)
        this.state.actions.upsertMessage(message)
        this.client?.serverHandler.send({
            type: "upsertMessage",
            data: message
        })
        // for (const id of chatUserIds) {
        //     this.client?.sendMessage(id, message)
        // }
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
}

export type Actions = typeof actions