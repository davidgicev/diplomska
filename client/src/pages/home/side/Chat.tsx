import React from "react";
import { StoreContext } from "../../../store/store";
import { AuthContext } from "../../../authStore/store";

interface Props {
    chat: Store.Chat
    users: Record<number, Store.User>
}

export default function Chat(props: Props): JSX.Element {
    const { activeChatId, actions: { setActiveChatId }, client: { chats: chatStatuses } } = React.useContext(StoreContext)
    const chat = props.chat;

    const { data: user } = React.useContext(AuthContext)

    // let showLastMessage = data.messages.length > 0 && data.status != 'typing';

    if (!user?.id) {
        return <></>
    }

    const typingUserIds = chatStatuses[chat.id]?.typingUserIds

    const typingUsernames = typingUserIds ? Object.keys(typingUserIds).map(x => props.users[x as unknown as number].username) : []

    const statusMessage = typingUsernames.length === 0 ? " " : chat.type === "private" ? "typing..." : typingUsernames.join(" and ") + ` ${typingUsernames.length > 1 ? "are" : "is"} typing...`

    const isActive = activeChatId === chat.id

    const title = chat.type === "group" ? chat.title : props.users[chat.userIds.find(id => id !== user.id) || user.id].username

    return (
        <button
            className={`flex flex-row p-6 px-4 text-left whitespace-nowrap max-w-[100%] overflow-hidden items-center ${isActive ? 'bg-light-olive':'bg-transparent'}`} 
            onClick={() => setActiveChatId(chat.id)}
        >  

            <div className={`w-12 h-12 bg-center bg-cover mr-5 rounded-full`} style={{ backgroundImage: `url('${chat.photo}')` }} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <p className="text-lg">
                    {title}
                </p>

                {
                    // showLastMessage
                    // ?
                    // <p className="text-sm opacity-50 text-ellipsis overflow-hidden">
                    //     {data.messages.slice(-1)[0].content}
                    // </p>
                    // :
                    <div className="text-sm animate-pulse">
                        {statusMessage}
                    </div>
                }
            </div>

        </button>
    );
}