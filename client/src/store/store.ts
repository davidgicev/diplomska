import React from "react"
import { StoreProvider } from "./StoreProvider"
import { Actions, actions } from "./actions"

export const StoreContext = React.createContext(
    {} as Store.Context
)

export function getBindedActions(context: StoreProvider): Actions {
    const binded: Record<string, unknown> = {}
    let key: keyof Actions;
    for (key in actions) {
        binded[key] = actions[key].bind(context)
    }
    return binded as Actions
}
