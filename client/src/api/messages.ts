import { APP_URL } from "..";

export async function getChatMessages(chatId: string): Promise<Record<string, Store.Message>> {
    try {
        const result = await fetch(
            APP_URL + "/api/getChatMessages?chatId=" + chatId
        )

        const parsed: Record<string, Store.Message> = await result.json()
        return parsed;
    }
    catch(e) {

    }
    return {}
}