import React from "react";
import Chat from "./Chat";
import StatusCard from "./StatusCard";
import { StoreContext } from "../../../store/store";
import Modal from "react-modal"
import ChatPopup from "./ChatPopup";

export default function Panel() {
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const { chats } = React.useContext(StoreContext)

    return (
        <div className="flex flex-col w-[30vw] bg-olive flex-1 text-white">
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className={"mx-auto mt-10 bg-mint-cream"}
                style={{ content: { width: "50vw", borderRadius: "1em", border: "none" }, overlay: { backgroundColor: "rgba(0,0,0,0.4)", zIndex: 10 } }}
            >
                <ChatPopup close={() => setIsModalOpen(false)} />
            </Modal>
            <div className="text-xl text-center bg-nickel py-4 h-20 flex items-center">
                <button 
                    className="h-8 w-8 pb-1 mx-6 mr-7 bg-olive flex justify-center items-center rounded-full" 
                    onClick={() => setIsModalOpen(true)}
                >
                    +
                </button>
                Chats
            </div>
            <div className="flex flex-col flex-1 relative">
                <div className="absolute w-full h-full custom-scroll">
                {
                    chats.map((chat) => (
                        <Chat
                            chat={chat} key={chat.id}
                        />
                    ))
                }
                </div>
            </div>


            <StatusCard />
        </div>
    );

}
