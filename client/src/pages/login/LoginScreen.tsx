import React from "react"
import { AuthContext } from "../../authStore/store"
import { useNavigate } from "react-router-dom"
import { saveUser } from "../../api/localStorage/auth"

export default function LoginScreen(): JSX.Element {
    const navigate = useNavigate()
    const { setUserData } = React.useContext(AuthContext)
    const [username, setUsername] = React.useState("")

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const login = () => {
        setUserData({ id: username })
        saveUser({ id: username })
        navigate("/home")
    }

    return (
        <div>
            <input value={username} onChange={onChange} />
            <button onClick={login}>Login</button>
        </div>
    ) 
}