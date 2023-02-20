import React from "react";

interface Props {
    chat: Store.Chat
}

export default function Header(props: Props): JSX.Element {
    const chat = props.chat

    return (
        <div className="flex flex-row items-center py-4 px-2 absolute top-0 w-[100%] backdrop-blur shadow-sm pl-6" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
            <div className={`w-12 h-12 bg-center bg-cover rounded-full`} style={{ backgroundImage: `url('${chat.photo}')` }} />
            <div className="flex flex-col items-start ml-4">
                <div className="text-xl">
                    {chat.title}
                </div>
                <div className="text-sm text-gray-500">
                    {/* {data.status} */}
                </div>
            </div>
        </div>
    );
}