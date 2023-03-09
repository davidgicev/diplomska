import { db } from "../database"
import { updateChat } from "../handler/chat"
import { updateMessage } from "../handler/message"
import { updateUser } from "../handler/user"
import { StoreProvider } from "./StoreProvider"
import { debounce } from "throttle-debounce"

export const actions = {

    setStoreData(this: StoreProvider, users: Store.Context["users"], chats: Store.Context["chats"], messages: Store.Context["messages"]) {
        this.setState({ users, chats, messages })
    },

    setServerConnectionStatus(this: StoreProvider, value: Store.Context["client"]["serverConnectionStatus"]) {
        this.setState({ client: {...this.state.client, serverConnectionStatus: value }})
    },

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

    removeUserConnection(this: StoreProvider, userId: number) {
        this.setState((state) => ({
            client: {
                ...state.client,
                users: {
                    ...state.client.users,
                    [userId]: {
                        ...state.client.users[userId],
                        connected: false,
                    }
                }
            }
        }))
    },

    updateDraftForChat(this: StoreProvider, chatId: string | number, content: string) {
        this.setState((state) => ({
            client: {
                ...state.client,
                chats: {
                    ...state.client.chats,
                    [chatId]: {
                        ...(state.client.chats[chatId] ?? {}),
                        draft: content,
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

    async deleteLocalDatabase(this: StoreProvider) {
        await db.delete()
    },

    async sendTypingEvent(this: StoreProvider, chat: Store.Chat, userId: number) {
        for (const id of chat.userIds) {
            this.client?.sendTypingEvent(id, chat.id, userId)
        }
    },

    async stopTyping(this: StoreProvider, chatId: string | number, userId: number) {
        this.typingIndicators[chatId].cancel({ upcomingOnly: true })
        this.setState(state => {
            let chatState = state.client.chats[chatId]
            chatState = { ...chatState, typingUserIds: { ...chatState.typingUserIds } }
            delete chatState.typingUserIds[userId]
            return {
                ...state,
                client: {
                    ...state.client,
                    chats: {
                        ...state.client.chats,
                        [chatId]: chatState
                    }
                }
            }
        })
    },

    async handleUserTypingEvent(this: StoreProvider, chatId: string | number, userId: number) {
        if (!this.typingIndicators[chatId]) {
            this.typingIndicators[chatId] = debounce(2000, () => {
                this.setState(state => {
                    let chatState = state.client.chats[chatId]
                    chatState = { ...chatState, typingUserIds: { ...chatState.typingUserIds } }
                    delete chatState.typingUserIds[userId]
                    return {
                        ...state,
                        client: {
                            ...state.client,
                            chats: {
                                ...state.client.chats,
                                [chatId]: chatState
                            }
                        }
                    }
                })})
        }
        else {
            this.typingIndicators[chatId]()
        }

        const state = this.state
        let chatState = state.client.chats[chatId] ?? { typingUserIds: {} }
        chatState = { ...chatState, typingUserIds: {...chatState.typingUserIds} }
        chatState.typingUserIds[userId] = true
        this.setState({
            ...state,
            client: {
                ...state.client,
                chats: {
                    ...state.client.chats,
                    [chatId]: chatState,
                }
            }
        })
    },

    async createNewChat(this: StoreProvider, title: string, userIds: number[]) {
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
        this.state.actions.setActiveChatId(chat.id)
    }
}

export type Actions = typeof actions