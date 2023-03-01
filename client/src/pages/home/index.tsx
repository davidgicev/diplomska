import React from "react";
import ChatPanel from "./main/Layout";
import SidePanel from "./side/Panel";
import { StoreContext } from "../../store/store";

export default function HomeScreen() {
    return (
        <div className="flex flex-col w-screen h-screen">
            
            <div className="flex flex-row flex-1">
                <SidePanel />
                <ChatPanel />
            </div>
        </div>
    );
}