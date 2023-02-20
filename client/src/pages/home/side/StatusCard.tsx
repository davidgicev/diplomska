import React from "react"
import { AuthContext } from "../../../authStore/store"
import { useNavigate } from "react-router-dom"
import { saveUser } from "../../../api/localStorage/auth"

export default function StatusCard(): JSX.Element {
    const navigate = useNavigate()
    const { setUserData, data } = React.useContext(AuthContext)

    const logout = () => {
        setUserData()
        saveUser()
        navigate("/login")
    }

    return (
        <div className="text-2xl pl-5 pb-5">
            {data?.id}
        </div>
    )
}