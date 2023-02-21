import React from "react";
import { AuthContext } from "../../../authStore/store";
import MessageBubble from "./MessageBubble";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../database";

interface Props {
    chat: Store.Chat
}

export default function Messages(props: Props): JSX.Element {
    const { data } = React.useContext(AuthContext)

    const messages = useLiveQuery(async () => {
        return await db.messages.where("chatId").equals(props.chat.id).toArray()
    }, [props.chat.id]) || []

    const fromUsers = useLiveQuery(async () => {
        return await Promise.all(messages.map(m => db.users.get(m.fromUserId)))
    }, [messages]) || []

    if (!data) {
        return <></>
    }

    console.log(messages)

    return (
        <div className="overflow-y-auto flex-1">
            <div className="flex flex-col h-[100%]">
                <div className="flex-1" />
                <div className="flex flex-col items-center justify-end">
                    {
                        messages.map((message, index) => (
                            <MessageBubble 
                                message={message}
                                user={fromUsers[index]}
                                fromSelf={fromUsers[index]?.id === data.id}
                                key={message.id}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}