import React from "react";
import { StoreContext } from "../../../store/store";
import { AuthContext } from "../../../authStore/store";
import { debounce, throttle } from "throttle-debounce";

interface Props {
    chat: Store.Chat
}

export default function Input(props: Props): JSX.Element {
    const [content, setContent] = React.useState("")

    const { actions: { sendMessage, sendTypingEvent }} = React.useContext(StoreContext)
    const { data } = React.useContext(AuthContext)

    const debouncedTypingCallback = React.useMemo(() => {
        return throttle(2000, () => {
            sendTypingEvent(props.chat, data?.id ?? -1)
        })
    }, [sendTypingEvent, props.chat, data?.id])

    const onPress = React.useCallback((event: React.KeyboardEvent | React.MouseEvent) => {
        if (!data?.id) {
            return
        }
        if(("key" in event) && event.key !== 'Enter') {
            return;
        }

        let value = content.trim()
        if(!value)
            return;

        setContent("")

        const id = "temp#" + Date.now().toString()

        sendMessage({
            id: id,
            tempId: id,
            chatId: props.chat.id,
            content: value,
            date: Date.now(),
            fromUserId: data.id,
            tempChatId: props.chat.tempId,
            lastUpdated: 0,
        }, props.chat.userIds)

        debouncedTypingCallback.cancel({ upcomingOnly: true })

    }, [sendMessage, setContent, content, props.chat, data, debouncedTypingCallback])
    
    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedTypingCallback()
        setContent(event.target.value)
    }, [setContent, debouncedTypingCallback]);


    return (
        <div className="flex flex-row bg-light-cyan justify-between">
            <input
                value={content}
                className="flex-1 p-2 m-2 bg-transparent outline-none"
                onKeyDown={onPress} onChange={onChange} 
            />
            <button onClick={onPress} className="mx-2 mr-5 text-olive">Send</button>
        </div>
    );
}