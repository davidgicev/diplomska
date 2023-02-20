import React from "react";
import { StoreContext } from "../../../store/store";
import Header from "./Header";
import Messages from "./Messages";
import Input from "./Input";

export default function Layout(): JSX.Element {

    const { chats, activeChatId } = React.useContext(StoreContext)

    if(!activeChatId)
        return <UnselectedChatPanel />;

    const chat = chats[activeChatId]

    return (
        <div className="flex flex-col w-[70vw] bg-mint-cream flex-2 justify-between relative shadow-xl">
            <Header chat={chat} />
            <Messages chat={chat} />
            <Input chat={chat} />
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