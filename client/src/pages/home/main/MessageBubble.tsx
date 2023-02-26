import React from "react";

interface Props {
    message: Store.Message
    user?: Store.User
    fromSelf: boolean
}

export default function MessageBubble(props: Props): JSX.Element {
    const { message, user } = props

    // let common = "flex p-2 px-4 my-2 rounded-3xl shadow-md max-w-[60%] whitespace-normal items-end flex-col "

    // if(props.fromSelf) {
    //     return (
    //         // "bg-white self-end rounded-br-md items-end mr-3"
    //         <div className="message message-self">
    //             {/* flex flex-1 */}
    //             <div>
    //                 <div>
    //                     {/* tuka slika */}
    //                 </div>
    //                 <div>
    //                     {props.message.content}
    //                 </div>
    //                 {/* text-sm text-gray-500 */}
    //                 <p>
    //                     {/* {getMessageDate(data.date)} */}
    //                 </p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        // flex flex-row self-start items-end ml-3 m-1 max-w-[60%] whitespace-normal
        <div className={`message ${props.fromSelf ? "message-self" : ""}`}>
            <div  
            // w-8 h-8 bg-center bg-cover mr-1 rounded-full
            // style={{ backgroundImage: `url('${user?.photo}')` }} 
            />
            {/* flex flex-1 p-2 px-4 my-2 rounded-3xl shadow-md whitespace-normal flex-col mb-0 bg-opal self-start rounded-bl-md items-start ml-1 */}
            <div>
                <div>
                    {/* <div className="self-start text-lg mb-2">
                        {data.user.username}
                    </div> */}
                    {/* "flex flex-1" */}
                    <div >
                        {message.content}
                    </div>
                    {/* "text-sm text-gray-500" */}
                    <p >
                        {/* {getMessageDate(data.date)} */}
                    </p>
                </div>
            </div>
        </div>
    );
}