import React from "react";
import { AuthContext } from "../../../authStore/store";
import MessageBubble from "./MessageBubble";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../database";
import "./Messages.css"

interface Props {
    chat: Store.Chat
}

export default function Messages(props: Props): JSX.Element {
    const { data } = React.useContext(AuthContext)
    const ref = React.useRef<HTMLDivElement>(null)

    const messages = useLiveQuery(async () => {
        return await db.messages.where("chatId").equals(props.chat.id).toArray()
    }, [props.chat.id], [])

    const fromUsers = useLiveQuery(async () => {
        return await Promise.all(messages.map(m => db.users.get(m.fromUserId)))
    }, [messages], [])

    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight
        }
    }, [messages])

    if (!data) {
        return <></>
    }

    console.log(messages)

    return (
        <div className="h-full overflow-y-scroll" ref={ref}>
            <div className="h-32" />
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
            <div className="h-4" />
        </div>
    );
}