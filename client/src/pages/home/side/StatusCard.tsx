import React from "react"
import { AuthContext } from "../../../authStore/store"
// import { useNavigate } from "react-router-dom"

export default function StatusCard(): JSX.Element {
    // const navigate = useNavigate()
    const { data } = React.useContext(AuthContext)

    // const logout = () => {
    //     setUserData()
    //     saveUser()
    //     navigate("/login")
    // }

    return (
        <div className="text-2xl pl-5 pb-5">
            {data?.id}
        </div>
    )
}