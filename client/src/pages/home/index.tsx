import React from "react";
import ChatPanel from "./main/Layout";
import SidePanel from "./side/Panel";
import { StoreContext } from "../../store/store";

export default function HomeScreen() {
    const { actions: { syncUsers, syncChats, syncMessages } } = React.useContext(StoreContext)
    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <button onClick={() => syncUsers() } >Sync users</button>
                <button onClick={() => syncChats() } >Sync chats</button>
                <button onClick={() => syncMessages() } >Sync messages</button>
            </div>
            <div className="flex flex-row h-screen">
                <SidePanel />
                <ChatPanel />
            </div>
        </div>
    );
}