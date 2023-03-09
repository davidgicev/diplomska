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

    const { messages: messagesRecord, users, actions: { sendMessage } } = React.useContext(StoreContext)

    const messages = messagesRecord[props.chat.id]

    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight
        }
    }, [props.chat.id])

    React.useEffect(() => {
        if (!ref.current) return;
        
        const { scrollHeight, scrollTop, clientHeight } = ref.current
        if (Math.abs(scrollTop + clientHeight - scrollHeight) < 200) {
            animateScroll.scrollToBottom({ containerId: "messagesWindow", duration: 200, ignoreCancelEvents: true })
        }
    }, [messages])

    const deleteMessage = (message: Store.Message) => {
        sendMessage({
            ...message,
            deleted: 1,
            lastUpdated: message.lastUpdated + 1,
        }, props.chat.userIds)
    }

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
                        deleteMessage={deleteMessage}
                    />
                ))
            }
            <div className="h-20" />
        </div>
    );
}