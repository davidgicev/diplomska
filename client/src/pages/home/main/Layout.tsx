import React from "react";
import { StoreContext } from "../../../store/store";
import Header from "./Header";
import Messages from "./Messages";
import Input from "./Input";
import { db } from "../../../database";
import { useLiveQuery } from "dexie-react-hooks";
import { AuthContext } from "../../../authStore/store";

export default function Layout(): JSX.Element {
    const { activeChatId } = React.useContext(StoreContext)
    const { data } = React.useContext(AuthContext)
    const chat = useLiveQuery(async () => {
        if (!activeChatId) {
            return
        }
        return db.chats.get(activeChatId)
    }, [activeChatId], null)

    const participants: Record<number, Store.User> = useLiveQuery(async () => {
        if (!chat) {
            return
        }
        return Object.fromEntries((await db.users.bulkGet(chat.userIds)).map((user) => [user?.id, user]));
    }, [chat], null)

    if (!chat || !participants || !data?.id)
        return <UnselectedChatPanel />;

    const modified = {...chat}

    if (chat.type === "private") {
        modified.title = Object.values(participants).find(x => x.id !== data.id)?.username || ""
    }

    return (
        <div className="relative h-full w-[70vw]">
            <div className="absolute w-full h-full flex flex-col">
                <Header chat={modified} />
                <Messages chat={modified} participants={participants} />
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