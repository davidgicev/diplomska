const url = "http://localhost:8080/api"

export async function syncUsers(): Promise<Store.User[]> {
    try {
        const result = await fetch(url + "/users/sync", {
                method: "PUT",
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                // body: JSON.stringify(user)
            }
        )

        const parsed: Store.User[] = await result.json()
        return parsed;
    }
    catch(e) {

    }
    return []
}