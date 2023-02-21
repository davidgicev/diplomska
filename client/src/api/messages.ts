const url = "http://localhost:8080/api"

export async function getChatMessages(chatId: string): Promise<Record<string, Store.Message>> {
    try {
        const result = await fetch(
            url + "/getChatMessages?chatId=" + chatId
        )

        const parsed: Record<string, Store.Message> = await result.json()
        return parsed;
    }
    catch(e) {

    }
    return {}
}