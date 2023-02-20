import React from "react";
import { StoreContext, getBindedActions } from "./store";
import WebSocketClient from "../client/WebSockerClient";

interface Props {
    userId: string
    children: React.ReactNode
}

export class StoreProvider extends React.Component<Props, Store.Context> {
    client?: WebSocketClient;

    constructor(props: Props) {
        super(props)
        this.state = {
            client: {
                serverConnectionStatus: "offline",
            },
            chats: {},
            users: {},
            actions: getBindedActions(this),
        }
    }

    componentDidMount(): void {
        console.log(this.props.userId)
        this.client = new WebSocketClient(this, this.props.userId)
    }

    render(): React.ReactNode {
        return (
            <StoreContext.Provider value={this.state}>
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}