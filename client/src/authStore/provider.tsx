import React from "react";
import { PropsWithChildren } from "react";
import { AuthContext } from "./store";

export class AuthStoreProvider extends React.Component<PropsWithChildren, AuthStore.Context> {
    state: AuthStore.Context = {
        data: undefined,
        setUserData: (data) => this.setState({ data })
    }

    render(): React.ReactNode {
        return (
            <AuthContext.Provider value={this.state}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}