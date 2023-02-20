import React from "react";
import ChatPanel from "./main/Layout";
import SidePanel from "./side/Panel";

export default function HomeScreen() {

    return (
        <div className="flex flex-row h-screen">
            <SidePanel />
            <ChatPanel />
        </div>
    );
}