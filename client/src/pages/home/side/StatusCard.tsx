import React from "react"
import { AuthContext } from "../../../authStore/store"
import { StoreContext } from "../../../store/store"
// import { useNavigate } from "react-router-dom"

export default function StatusCard(): JSX.Element {
    // const navigate = useNavigate()
    const { actions: { syncWithServer } } = React.useContext(StoreContext)
    const { data } = React.useContext(AuthContext)

    // const logout = () => {
    //     setUserData()
    //     saveUser()
    //     navigate("/login")
    // }

    if (!data) {
        return <></>
    }

    return (
        <div className="flex flex-row text-2xl px-5 pb-5 items-center justify-between">
            {data.username}
            <button onClick={() => syncWithServer() } className="bg-light-olive px-5 py-1 rounded-full text-[0.8em]" >Sync</button>
        </div>
    )
}