import React from "react";
import { AuthContext } from "../../../authStore/store";
import MessageBubble from "./MessageBubble";
import "./Messages.css"
import { StoreContext } from "../../../store/store";
import { animateScroll } from "react-scroll";

interface Props {
    chat: Store.Chat
}

export default function Messages(props: Props): JSX.Element {
    const { data } = React.useContext(AuthContext)
    const ref = React.useRef<HTMLDivElement>(null)

    const { messages: messagesRecord, users } = React.useContext(StoreContext)

    const messages = messagesRecord[props.chat.id]

    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight
        }
    }, [props.chat.id])

    React.useEffect(() => {
        animateScroll.scrollToBottom({ containerId: "messagesWindow", duration: 200 })
    }, [messages])

    if (!data) {
        return <></>
    }
    return (
        <div id="messagesWindow" className="h-full custom-scroll lg:px-[5vw] xl:px-[10vw]" ref={ref}>
            <div className="h-32" />
            {
                messages.map((message) => (
                    <MessageBubble 
                        message={message}
                        user={users[message.fromUserId]}
                        fromSelf={message.fromUserId === data.id}
                        key={message.id}
                    />
                ))
            }
            <div className="h-20" />
        </div>
    );
}