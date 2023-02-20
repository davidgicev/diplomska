import React from "react";
import { StoreContext } from "../../../store/store";
import Chat from "./Chat";
import StatusCard from "./StatusCard";


export default function Panel() {

    const { chats } = React.useContext(StoreContext)

    // chats.sort((a:Chat, b:Chat) => {
    //     if(a.messages.length == 0 && b.messages.length == 0)
    //         return 0
    //     if(a.messages.length == 0)
    //         return 1
    //     if(b.messages.length == 0)
    //         return -1

    //     return a.messages.slice(-1)[0].date!.getTime() > b.messages.slice(-1)[0].date!.getTime() ? -1 : 1
    // })

    console.log(chats)


    return (
        <div className="flex flex-col w-[30vw] bg-olive flex-1 text-white">
            <div className="text-xl text-center bg-nickel py-4 h-20 flex justify-center items-center">
                Chats
            </div>
            <div className="flex flex-col flex-1">
            {
                Object.values(chats).map((chat) => (
                    <Chat
                        data={chat} key={chat.id} 
                    />
                ))
            }
            </div>

            <StatusCard />

            {/* <div className="text-xl flex text-center bg-light-olive py-4 flex justify-between items-center">
                
                <div className="flex flex-1 flex-row ml-5 items-center flex-wrap">
                    <div className={`w-10 h-10 bg-center bg-cover mr-2 rounded-full`} style={{ backgroundImage: `url('${user.avatar}')` }} />
                    <div className="flex flex-col items-start">
                        <p className="text-md">
                            {user.username}
                        </p>
                        <p className="text-xs leading-none">
                            online
                        </p>
                    </div>
                </div>
                <button onClick={logout} className="mr-5 text-lg bg-opal text-mint-cream px-4 py-1 rounded-full" >
                    Log out
                </button>
            </div> */}
        </div>
    );

}
