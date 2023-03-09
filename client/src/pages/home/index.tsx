import React from "react";
import ChatPanel from "./main/Layout";
import SidePanel from "./side/Panel";
import { StoreContext } from "../../store/store";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../database";

export default function HomeScreen() {
    const { actions } = React.useContext(StoreContext)

    const [ users, chats, messages ] = useLiveQuery(async () => {
        const users = Object.fromEntries((await db.users.toArray()).map(u => [u.id, u]))
        const chats = await db.chats.toArray()

        const messagesResolved = await Promise.all(chats.map(chat => db.messages.where("chatId").equals(chat.id).filter(x => !x.deleted).sortBy("date")))
        const messages = Object.fromEntries(chats.map((chat, i) => [chat.id, messagesResolved[i]]))
        const lastMessages = Object.fromEntries(Object.entries(messages).map(([chatId, messages]) => [chatId, messages.slice(-1).pop()?.date ?? 0]))
        chats.sort((a, b) => lastMessages[a.id] < lastMessages[b.id] ? 1 : -1)
        return [ users, chats, messages ]
    }, [], [{}, [], {}])

    React.useEffect(() => { actions.setStoreData(users, chats, messages) }, [users, chats, messages, actions])

    return (
        <div className="flex flex-col w-screen h-screen">
            
            <div className="flex flex-row flex-1">
                <SidePanel />
                <ChatPanel />
            </div>
        </div>
    );
}