import React from "react";
import { StoreContext } from "../../../store/store";
import Header from "./Header";
import Messages from "./Messages";
import Input from "./Input";
import { AuthContext } from "../../../authStore/store";

export default function Layout(): JSX.Element {
    const { activeChatId, chats, users } = React.useContext(StoreContext)
    const { data } = React.useContext(AuthContext)
    const chat = chats.find(c => c.id === activeChatId) || chats.find(c => c.tempId === activeChatId)

    if (!chat || !data?.id)
        return <UnselectedChatPanel />;

    const modified = {...chat}

    if (chat.type === "private") {
        modified.title = modified.title || Object.values(users).find(x => x.id !== data.id)?.username || ""
        modified.photo = modified.type === "group" ? chat.photo : chat.userIds.length === 1 ? "" : users[chat.userIds.find(id => id !== data.id) || data.id]?.photo || ""
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