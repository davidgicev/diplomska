import React from "react";

interface Props {
    message: Store.Message
    user: Store.User
    fromSelf: boolean
}

export default function MessageBubble(props: Props): JSX.Element {
    const { message, user } = props

    let common = "flex p-2 px-4 my-2 rounded-3xl shadow-md max-w-[60%] whitespace-normal items-end flex-col "

    if(props.fromSelf) {
        return (
            <div className={common+"bg-white self-end rounded-br-md items-end mr-3"} style={{ wordBreak: 'break-word' }}>
                <div className="flex flex-1">
                    {props.message.content}
                </div>
                <p className="text-sm text-gray-500">
                    {/* {getMessageDate(data.date)} */}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-row self-start items-end ml-3 m-1 max-w-[60%] whitespace-normal">
            {user.photo &&
                <div className={`w-8 h-8 bg-center bg-cover mr-1 rounded-full`} style={{ backgroundImage: `url('${user.photo}')` }} />
            }
            <div className={"flex flex-1 p-2 px-4 my-2 rounded-3xl shadow-md whitespace-normal flex-col mb-0 bg-opal self-start rounded-bl-md items-start ml-1"} style={{ wordBreak: 'break-word' }}>
                
                <div>
                    {/* <div className="self-start text-lg mb-2">
                        {data.user.username}
                    </div> */}
                    <div className="flex flex-1">
                        {message.content}
                    </div>
                    <p className="text-sm text-gray-500">
                        {/* {getMessageDate(data.date)} */}
                    </p>
                </div>
            </div>
        </div>
    );
}