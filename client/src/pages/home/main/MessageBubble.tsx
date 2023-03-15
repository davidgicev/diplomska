import React from "react";
import { BsFillPersonFill } from "react-icons/bs"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"

interface Props {
    message: Store.Message
    user: Store.User
    fromSelf: boolean
    deleteMessage: (message: Store.Message) => void
    editMessage: (message: Store.Message) => void
}

export default function MessageBubble(props: Props): JSX.Element {
    const { message, user } = props

    return (
        <div className={`message ${props.fromSelf ? "message-self" : ""}`}>
            <div>
                {user.photo && (
                    <div 
                        style={{ backgroundImage: `url('${user?.photo}')` }} 
                    />
                )}
                {!user.photo && (
                    <BsFillPersonFill size={"1.5em"} />
                )}    
            </div>
            <div>
                <div title={new Date(message.date).toUTCString()}>
                    <div>
                        {user.username}
                    </div>
                    <div >
                        {message.content}
                    </div>
                </div>
            </div>
            {props.fromSelf && (
                <div>
                    <button onClick={() => props.editMessage(props.message)}>
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