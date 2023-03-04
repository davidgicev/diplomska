import React from "react";
import Chat from "./Chat";
import StatusCard from "./StatusCard";
import { db } from "../../../database";
import { useLiveQuery } from "dexie-react-hooks";
import { StoreContext } from "../../../store/store";

export default function Panel() {

    const { chats, users } = React.useContext(StoreContext)

    const { actions: { createNewChat } } = React.useContext(StoreContext)

    return (
        <div className="flex flex-col w-[30vw] bg-olive flex-1 text-white">
            <div className="text-xl text-center bg-nickel py-4 h-20 flex items-center">
                <button className="h-8 w-8 pb-1 mx-6 mr-7 bg-olive flex justify-center items-center rounded-full" onClick={createNewChat}>+</button>
                Chats
            </div>
            <div className="flex flex-col flex-1 relative">
                <div className="absolute w-full h-full custom-scroll">
                {
                    chats.map((chat) => (
                        <Chat
                            chat={chat} key={chat.id}
                        />
                    ))
                }
                </div>
            </div>


            <StatusCard />
        </div>
    );

}
