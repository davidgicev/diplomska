import React from "react";
import { StoreContext } from "../../../store/store";
import Header from "./Header";
import Messages from "./Messages";
import Input from "./Input";
import { db } from "../../../database";
import { useLiveQuery } from "dexie-react-hooks";

export default function Layout(): JSX.Element {
    const { activeChatId } = React.useContext(StoreContext)
    const chat = useLiveQuery(async () => {
        if (!activeChatId) {
            return
        }
        return db.chats.get(activeChatId)
    }, [activeChatId])

    if (!chat)
        return <UnselectedChatPanel />;

    const modified = {...chat}

    if (chat.type === "private") {
        modified.title = chat.userIds.join(" and ")
    }

    return (
        <div className="relative h-full w-[70vw]">
            <div className="absolute w-full h-full flex flex-col">
                <Header chat={modified} />
                <Messages chat={modified} />
                <Input chat={modified} />
            </div>
        </div>
    );
}

function UnselectedChatPanel() {
    return (
        <div className="flex w-[70vw] items-center justify-center text-xl text-olive bg-mint-cream">
            Select a chat from the side panel
        </div>
    );
}