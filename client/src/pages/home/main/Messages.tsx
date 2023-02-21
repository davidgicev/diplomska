import React from "react";
import { StoreContext } from "../../../store/store";
import { AuthContext } from "../../../authStore/store";
import MessageBubble from "./MessageBubble";
import { getOrderedMessages } from "../../../store/selectors";

interface Props {
    chat: Store.Chat
}

export default function Messages(props: Props): JSX.Element {
    const { data } = React.useContext(AuthContext)
    const { users } = React.useContext(StoreContext)

    if (!data) {
        return <></>
    }

    const chat = props.chat
    const messages = getOrderedMessages(chat).map((message) => ({
        message,
        user: users[message.fromUserId],
        fromSelf: message.fromUserId === data.id
    }))

    return (
        <div className="overflow-y-auto flex-1">
            <div className="flex flex-col h-[100%]">
                <div className="flex-1" />
                <div className="flex flex-col items-center justify-end">
                    {
                        messages.map((data) => <MessageBubble {...data} key={data.message.id} />)
                    }
                </div>
            </div>
        </div>
    );
}