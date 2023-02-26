import React from "react";
import { StoreContext, getBindedActions } from "./store";
import WebSocketClient from "../client/WebSockerClient";

interface Props {
    user: AuthStore.User
    children: React.ReactNode
}

export class StoreProvider extends React.Component<Props, Store.Context> {
    client?: WebSocketClient;

    constructor(props: Props) {
        super(props)
        this.state = {
            client: {
                serverConnectionStatus: "offline",
                users: {}
            },
            chats: {},
            users: {},
            messages: {},
            actions: getBindedActions(this),
        }
    }

    componentDidMount(): void {
        this.client = new WebSocketClient(this, this.props.user)
    }

    render(): React.ReactNode {
        return (
            <StoreContext.Provider value={this.state}>
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}