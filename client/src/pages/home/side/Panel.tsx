import React from "react";
import Chat from "./Chat";
import StatusCard from "./StatusCard";
import { db } from "../../../database";
import { useLiveQuery } from "dexie-react-hooks";
import { StoreContext } from "../../../store/store";

export default function Panel() {

    const data: [Store.Chat[], Record<number, Store.User>] | null = useLiveQuery(async () => {
        const [ chats, usersArray ] = await Promise.all([db.chats.toArray(), db.users.toArray()])
        return [chats,
            Object.fromEntries(usersArray.map(x => [x.id, x]))
        ]
    }, [], null)

    const { actions: { createNewChat } } = React.useContext(StoreContext)

    if (!data) {
        return <></>
    }

    const [ chats, users ] = data

    return (
        <div className="flex flex-col w-[30vw] bg-olive flex-1 text-white">
            <div className="text-xl text-center bg-nickel py-4 h-20 flex items-center">
                <button className="h-8 w-8 pb-1 mx-6 mr-7 bg-olive flex justify-center items-center rounded-full" onClick={createNewChat}>+</button>
                Chats
            </div>
            <div className="flex flex-col flex-1">
            {
                chats.map((chat) => (
                    <Chat
                        chat={chat} key={chat.id} users={users}
                    />
                ))
            }
            </div>


            <StatusCard />
        </div>
    );

}
