import { APP_URL } from "../..";

export async function syncMessages(): Promise<Store.Message[]> {
    try {
        const result = await fetch(APP_URL + "/messages/sync", {
                method: "PUT",
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                // body: JSON.stringify(user)
            }
        )

        const parsed: Store.Message[] = await result.json()
        return parsed;
    }
    catch(e) {

    }
    return []
}