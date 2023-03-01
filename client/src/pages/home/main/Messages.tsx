import React from "react";
import { AuthContext } from "../../../authStore/store";
import MessageBubble from "./MessageBubble";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../database";
import "./Messages.css"

interface Props {
    chat: Store.Chat
    participants: Record<number, Store.User>
}

export default function Messages(props: Props): JSX.Element {
    const { data } = React.useContext(AuthContext)
    const ref = React.useRef<HTMLDivElement>(null)

    const messages = useLiveQuery(async () => {
        return await db.messages.where("chatId").equals(props.chat.id).sortBy("date");
    }, [props.chat.id], [])

    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight
        }
    }, [messages])

    if (!data) {
        return <></>
    }

    console.log(messages)

    const { participants } = props

    return (
        <div className="h-full overflow-y-scroll" ref={ref}>
            <div className="h-32" />
            {
                messages.map((message) => (
                    <MessageBubble 
                        message={message}
                        user={participants[message.fromUserId]}
                        fromSelf={message.fromUserId === data.id}
                        key={message.id}
                    />
                ))
            }
            <div className="h-4" />
        </div>
    );
}