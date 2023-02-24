declare namespace AuthStore {
    interface User {
        id: number
        username: string
        token: string
    }

    interface Context {
        data?: User
        setUserData: (data?: User) => void
    }
}