import React from "react";
import { StoreContext } from "../../../store/store";

interface Props {
    data: Store.Chat
}

export default function Chat(props: Props): JSX.Element {
    const { activeChatId, actions: { setActiveChatId } } = React.useContext(StoreContext)
    const data = props.data;

    // let showLastMessage = data.messages.length > 0 && data.status != 'typing';

    const isActive = activeChatId === data.id

    return (
        <button
            className={`flex flex-row p-6 px-4 text-left whitespace-nowrap max-w-[100%] overflow-hidden items-center ${isActive ? 'bg-light-olive':'bg-transparent'}`} 
            onClick={() => setActiveChatId(data.id)}
        >  

            <div className={`w-12 h-12 bg-center bg-cover mr-5 rounded-full`} style={{ backgroundImage: `url('${data.photo}')` }} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <p className="text-lg">
                    {data.title}
                </p>

                {/* {
                    showLastMessage
                    ?
                    <p className="text-sm opacity-50 text-ellipsis overflow-hidden">
                        {data.messages.slice(-1)[0].content}
                    </p>
                    :
                    <p className="text-sm opacity-50">
                        {data.status}
                    </p>
                } */}
            </div>

        </button>
    );
}