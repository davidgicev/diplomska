import React from "react";
import { BsFillPersonFill } from "react-icons/bs"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { StoreContext } from "../../../store/store";

interface Props {
    message: Store.Message
    user: Store.User
    fromSelf: boolean
    deleteMessage: (message: Store.Message) => void
}

export default function MessageBubble(props: Props): JSX.Element {
    const { actions: { upsertMessage } } = React.useContext(StoreContext)
    const { message, user } = props

    return (
        <div className={`message ${props.fromSelf ? "message-self" : ""}`}>
            <div
            // w-8 h-8 bg-center bg-cover mr-1 rounded-full
            // style={{ backgroundImage: `url('${user?.photo}')` }} 
            >
            {!user.photo && (
                <BsFillPersonFill size={"1.5em"} />
            )}    
            </div>
            {/* flex flex-1 p-2 px-4 my-2 rounded-3xl shadow-md whitespace-normal flex-col mb-0 bg-opal self-start rounded-bl-md items-start ml-1 */}
            <div>
                <div title={new Date(message.date).toUTCString()}>
                    <div>
                        {user.username}
                    </div>
                    {/* "flex flex-1" */}
                    <div >
                        {message.content}
                    </div>
                    {/* "text-sm text-gray-500" */}
                </div>
            </div>
            {props.fromSelf && (
                <div
                // w-8 h-8 bg-center bg-cover mr-1 rounded-full
                // style={{ backgroundImage: `url('${user?.photo}')` }} 
                >
                    <button>
                        <AiOutlineEdit size={"1.5em"} />
                    </button>
                    <button onClick={() => props.deleteMessage(props.message)}>
                        <AiOutlineDelete size={"1.5em"} />
                    </button>
                </div>
            )}
        </div>
    );
}