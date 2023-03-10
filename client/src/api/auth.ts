const url = "http://localhost:8080/api"

export interface RegisterResponse {
    id: number
    token: string
}

export async function registerUser(user: Store.User): Promise<RegisterResponse | undefined> {
    try {
        const result = await fetch(url + "/registerUser", {
                method: "POST",
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            }
        )

        const parsed: RegisterResponse = await result.json()
        return parsed;
    }
    catch(e) {

    }
    return
}