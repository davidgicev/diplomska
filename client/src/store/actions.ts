import { getChatMessages } from "../api/messages"
import { StoreProvider } from "./StoreProvider"

export const actions = {
    addNewUser(this: StoreProvider, user: Store.User) {
        console.log("Store: adding new user", user)
        this.setState((state) => ({
            users: {
                ...state.users,
                [user.id]: user,
            },
        }))
    },

    async addNewChat(this: StoreProvider, chat: Store.Chat) {
        console.log("Store: adding new chat", chat)

        this.setState((state) => {
            if (chat.id in state.chats) {
                return {
                    chats: {
                        ...state.chats,
                        [chat.id]: {
                            ...state.chats[chat.id],
                            ...chat,
                            messages: {
                                ...state.chats[chat.id].messages,
                                ...chat.messages,
                            }
                        },
                    }
                }
            }

            return {
                chats: {
                    ...state.chats,
                    [chat.id]: chat
                }
            }
    
        })

        const messages = await getChatMessages(chat.id)
        for (const messageId in messages) {
            this.state.actions.addNewMessage(messages[messageId])
        }
    },

    setActiveChatId(this: StoreProvider, activeChatId: string) {
        this.setState({ activeChatId })
    },

    addNewMessage(this: StoreProvider, message: Store.Message) {
        this.setState((state) => {
            const targetChat = state.chats[message.chatId]
    
            if (!targetChat) {
                throw new Error("bitch chatov ne postoi")
            }
    
            const chatCopy = { ...targetChat, messages: { ...targetChat.messages } }
            if (message.id.startsWith("temp")) {
                const target = Object.values(chatCopy.messages).find((m) => m.tempId === message.tempId)
                if (target) {
                    chatCopy.messages[target.id] = {
                        ...target,
                        ...message,
                        id: target.id,
                    }
                    return {}
                }
            }
            else {
                delete chatCopy.messages[message.tempId]
            }
            if (chatCopy.messages[message.id]) {
                chatCopy.messages[message.id] = {...chatCopy.messages[message.id], ...message}
            }
            else {
                chatCopy.messages[message.id] = message
            }
            return {
                ...state,
                chats: {
                    ...state.chats,
                    [targetChat.id]: chatCopy
                }
            }
        })
    },

    sendMessage(this: StoreProvider, message: Store.Message) {
        console.log("Store: Sending new message", message)
        this.state.actions.addNewMessage(message)
        const chat = this.state.chats[message.chatId]
        this.client?.serverHandler.send({
            type: "newMessage",
            data: message
        })
        const users = chat.userIds
        for (const id of users) {
            this.client?.sendMessage(id, message)
        }
    }
}

export type Actions = typeof actions