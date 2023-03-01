import React from "react";
import { StoreContext, getBindedActions } from "./store";
import WebSocketClient from "../client/WebSockerClient";
import { debounce } from "throttle-debounce";

interface Props {
    user: AuthStore.User
    children: React.ReactNode
}

export class StoreProvider extends React.Component<Props, Store.Context> {
    client?: WebSocketClient;
    typingIndicators: Record<string | number, debounce<() => void>> = {}

    constructor(props: Props) {
        super(props)
        this.state = {
            client: {
                serverConnectionStatus: "offline",
                users: {},
                chats: {},
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