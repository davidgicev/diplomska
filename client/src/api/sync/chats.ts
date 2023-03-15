import { APP_URL } from "../..";

export async function syncChats(): Promise<Store.Chat[]> {
    try {
        const result = await fetch(APP_URL + "/chats/sync", {
                method: "PUT",
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                // body: JSON.stringify(user)
            }
        )

        const parsed: Store.Chat[] = await result.json()
        return parsed;
    }
    catch(e) {

    }
    return []
}