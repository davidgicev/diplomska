import { StoreProvider } from "./StoreProvider"

export const actions = {
    addNewUser(this: StoreProvider, user: Store.User) {
        console.log("Store: adding new user", user)
        this.setState((state) => ({
            users: {
                ...state.users,
                [user.id]: user,
            },
        }), () => {
            console.log("users in store:", this.state.users)
        })
    },

    addNewChat(this: StoreProvider, chat: Store.Chat) {
        console.log("Store: adding new chat", chat)
        this.setState((state) => ({
            chats: {
                ...state.chats,
                [chat.id]: chat
            }
        }))
    },

    setActiveChatId(this: StoreProvider, activeChatId: string) {
        this.setState({ activeChatId })
    },

    addNewMessage(this: StoreProvider, message: Store.Message) {
        console.log("Store: adding new message", message)
        const targetChat = this.state.chats[message.chatId]

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
            }
            return
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
        this.setState({
            ...this.state,
            chats: {
                ...this.state.chats,
                [targetChat.id]: chatCopy
            }
        })
        console.log("set messages to", chatCopy.messages)
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