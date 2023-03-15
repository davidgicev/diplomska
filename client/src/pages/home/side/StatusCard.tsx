import React from "react"
import { AuthContext } from "../../../authStore/store"
import { StoreContext } from "../../../store/store"
import { BsFillPersonFill } from "react-icons/bs"
import { MdOutlineLogout } from "react-icons/md"
import { GoSync } from "react-icons/go"
import { saveUser } from "../../../api/localStorage/auth"

export default function StatusCard(): JSX.Element {
    const { users, client: { serverConnectionStatus }, actions: { syncWithServer } } = React.useContext(StoreContext)
    const { data, setUserData } = React.useContext(AuthContext)

    const logout = () => {
        setUserData()
        saveUser()
        window.location.href = "/login"
    }

    if (!data) {
        return <></>
    }

    const photo = users[data.id]?.photo

    return (
        <>
            {/* <button onClick={deleteLocalDatabase} className="bg-red-500 my-4 mx-2 px-5 py-1 rounded-full text-lg" >Delete local database</button> */}
            <div className="flex flex-row text-2xl px-8 py-4 bg-light-olive items-center justify-between">
                <div className="flex flex-row items-center">
                    <div className={`w-12 h-12 bg-center bg-cover mr-2 rounded-full flex items-center justify-center bg-olive text-white`} style={{ backgroundImage: `url('${photo}')` }}>
                        {!photo && (
                            <BsFillPersonFill size={"1em"} />
                        )}
                    </div>
                    <div className="ml-2">
                        {data.username}
                        <div className="text-sm">{serverConnectionStatus}</div>
                    </div>
                </div>
                <div>
                    <button onClick={syncWithServer} className="bg-opal mr-2 text-white p-2 rounded-full text-[0.8em]" > <GoSync size={22} /> </button>
                    <button onClick={logout} className="bg-red-400 text-white p-2 rounded-full text-[0.8em]" > <MdOutlineLogout size={22} /> </button>
                </div>
            </div>
        </>
    )
}