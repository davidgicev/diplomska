const url = "http://localhost:8080/api"

export async function syncMessages(): Promise<Store.Message[]> {
    try {
        const result = await fetch(url + "/messages/sync", {
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