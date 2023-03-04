import React from "react";
import { StoreContext } from "../../../store/store";
import { AuthContext } from "../../../authStore/store";
import { BsFillPeopleFill, BsFillPersonFill } from "react-icons/bs";
import { SlNotebook } from "react-icons/sl"

interface Props {
    chat: Store.Chat
}

export default function Chat(props: Props): JSX.Element {
    const chat = props.chat;
    const { activeChatId, messages, users, actions: { setActiveChatId }, client: { chats: chatStatuses } } = React.useContext(StoreContext)
    const { data: user } = React.useContext(AuthContext)
    
    if (!user?.id) {
        return <></>
    }

    const messagesInChat = messages[chat.id]
    const lastMessage = messagesInChat.slice(-1).pop()?.content

    const typingUserIds = chatStatuses[chat.id]?.typingUserIds

    const typingUsernames = typingUserIds ? Object.keys(typingUserIds).map(x => users[x as unknown as number].username) : []

    const statusMessage = typingUsernames.length === 0 ? "" : chat.type === "private" ? "typing..." : typingUsernames.join(" and ") + ` ${typingUsernames.length > 1 ? "are" : "is"} typing...`

    const isActive = activeChatId === chat.id

    const title = chat.type === "group" ? chat.title : chat.title || users[chat.userIds.find(id => id !== user.id) || user.id].username

    return (
        <button
            className={`flex flex-row p-6 px-4 text-left whitespace-nowrap w-full overflow-hidden items-center ${isActive ? 'bg-light-olive':'bg-transparent'}`} 
            onClick={() => setActiveChatId(chat.id)}
        >  

            <div className={`w-12 h-12 bg-center bg-cover mr-5 rounded-full flex items-center justify-center bg-light-olive`} style={{ backgroundImage: `url('${chat.photo}')` }}>
                {(!chat.photo && chat.type === "group") ? (
                    <BsFillPeopleFill size={"1.5em"} />
                ) : chat.userIds.length > 1 ? (
                    <BsFillPersonFill size={"1.5em"} />
                ): (
                    <SlNotebook size={"1.5em"} />
                )}
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
                <p className="text-lg">
                    {title}
                </p>

                {
                    statusMessage
                    ?
                    <div className="text-sm animate-pulse">
                        {statusMessage || lastMessage?.toString()}
                    </div>
                    :
                    <p className="text-sm opacity-50 text-ellipsis overflow-hidden">
                        {lastMessage?.toString()}
                    </p>
                }
            </div>

        </button>
    );
}