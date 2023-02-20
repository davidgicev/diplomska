declare namespace AuthStore {
    interface User {
        id: string
    }

    interface Context {
        data?: User
        setUserData: (data?: User) => void
    }
}