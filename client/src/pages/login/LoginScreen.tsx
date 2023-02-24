import React from "react"
import { AuthContext } from "../../authStore/store"
import { useNavigate } from "react-router-dom"
import { saveUser } from "../../api/localStorage/auth"
import { registerUser } from "../../api/auth"

export default function LoginScreen(): JSX.Element {
    const navigate = useNavigate()
    const { setUserData } = React.useContext(AuthContext)
    const [username, setUsername] = React.useState("")

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const login = async () => {
        const result = await registerUser({
            id: -1,
            username,
        })
        if (!result) {
            return
        }
        const { id, token } = result
        const savedUser = { id, token, username }
        setUserData(savedUser)
        saveUser(savedUser)
        navigate("/home")
    }

    return (
        <div>
            <input value={username} onChange={onChange} />
            <button onClick={login}>Login</button>
        </div>
    ) 
}