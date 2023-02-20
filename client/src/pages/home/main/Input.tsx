import React from "react";
import { StoreContext } from "../../../store/store";
import { AuthContext } from "../../../authStore/store";

interface Props {
    chat: Store.Chat
}

export default function Input(props: Props): JSX.Element {
    // React.useEffect(() => {
    //     inputRef.current?.focus();
    // }, [])

    const [content, setContent] = React.useState("")

    const { actions: { sendMessage }} = React.useContext(StoreContext)
    const { data } = React.useContext(AuthContext)

    //najdi nachin tajmerot da go abortnesh

    // const onTyping = React.useCallback(debounce((message:string) => {
    //         sendTypingIndicator(props.chat.id, userContext.channel)
    //     }, 1000, true)
    // , [props.chat.id, userContext.channel])

    const onPress = React.useCallback((event: React.KeyboardEvent | React.MouseEvent) => {
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
            fromUserId: data?.id || "",
        })

    }, [sendMessage, setContent, content, props.chat.id, data])
    
    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        // onTyping(inputRef.current?.value);
        setContent(event.target.value)
    }, [setContent]);


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