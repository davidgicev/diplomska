export function saveUser(user?: AuthStore.User) {
    if(!user) {
        localStorage.removeItem("userStore")
        return
    }
    localStorage.setItem("userStore", JSON.stringify(user))
}

export function getUser() {
    return localStorage.getItem("userStore")
}