export function getOrderedMessages(chat: Store.Chat): Store.Message[] {
    console.log(Object.values(chat.messages).map(m => `${m.content} ${m.date}`))
    return Object.values(chat.messages).sort((m1, m2) => m1.date > m2.date ? 1 : -1)
}