import React from "react";
import { StoreContext } from "../../../store/store";
import { BsFillPeopleFill, BsFillPersonFill } from "react-icons/bs";
import { SlNotebook } from "react-icons/sl";

interface Props {
    chat: Store.Chat
}

export default function Header(props: Props): JSX.Element {
    const { client: { chats: chatStatuses, users: userStatuses }, users } = React.useContext(StoreContext)
    const chat = props.chat

    const typingUserIds = chatStatuses[chat.id]?.typingUserIds

    const typingUsernames = typingUserIds ? Object.keys(typingUserIds).map(x => users[x as unknown as number].username) : []

    const typingStatusMessage = typingUsernames.length === 0 ? "" : chat.type === "private" ? "typing..." : typingUsernames.join(" and ") + ` ${typingUsernames.length > 1 ? "are" : "is"} typing...`

    const countOnline = chat.userIds.map(id => userStatuses[id]?.connected).reduce((sum, curr) => sum + Number(!!curr), 1)

    const countOnlineMessage = chat.type === "group" ? countOnline + " online" : chat.userIds.length === 1 ? "store notes here" : countOnline === 1 ? "offline" : "online"

    const statusMessage = typingStatusMessage || countOnlineMessage || ""

    return (
        <div className="z-10 flex flex-row items-center py-4 px-2 absolute top-0 w-[100%] backdrop-blur shadow-sm pl-6" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
            <div className={`w-12 h-12 bg-center bg-cover ml-8 mr-2 rounded-full flex items-center justify-center bg-light-olive text-white`} style={{ backgroundImage: `url('${chat.photo}')` }}>
                {chat.photo && (
                    <div className="w-full h-full bg-cover bg-center rounded-full" style={{ backgroundImage: `url('${chat.photo}')` }} />
                )}
                {chat.photo ? "" : chat.type === "group" ? (
                    <BsFillPeopleFill size={"1.5em"} />
                ) : chat.userIds.length > 1 ? (
                    <BsFillPersonFill size={"1.5em"} />
                ): (
                    <SlNotebook size={"1.5em"} />
                )}
            </div>
            <div className="flex flex-col items-start ml-4">
                <div className="text-xl">
                    {chat.title}
                </div>
                <div className="text-sm text-gray-500">
                    {statusMessage}
                </div>
            </div>
        </div>
    );
}