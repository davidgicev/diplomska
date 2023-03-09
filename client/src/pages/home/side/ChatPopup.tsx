import React from "react";
import Select, { MultiValue, SelectInstance } from "react-select";
import { StoreContext } from "../../../store/store";
import { AuthContext } from "../../../authStore/store";

interface Option {
    value: number
    label: string
}

export default function ChatPopup(): JSX.Element {
    const [ title, setTitle ] = React.useState("")
    const picker = React.useRef<SelectInstance<Option>>(null)
    const { data } = React.useContext(AuthContext)
    const { users, actions: { createNewChat } } = React.useContext(StoreContext)

    if (!data) {
        return <></>
    }

    const options: Option[] = Object.values(users).filter(u => u.id !== data.id).map(u => ({ value: u.id, label: u.username }))

    const submit = () => {
        const members = picker.current?.getValue().map(x => x.value) || []
        members.push(data.id)
        createNewChat(title, members)
    }
    
    return (
        <div className="w-full h-full p-10 flex flex-col text-md">
            <div className="text-2xl mb-5 mx-auto">New group chat</div>
            <div className="separator mb-12" />
            
            <div className="text-xl mb-2 ml-4">Title</div>
            <input className="mb-5 rounded-xl outline-opal bg-light-cyan px-4 py-3" value={title} onChange={(ev) => setTitle(ev.target.value)} />

            <div className="text-xl mb-2 ml-4">Members</div>
            <div className="text-lg">
                <Select
                    ref={picker}
                    isMulti
                    options={options}
                    classNames={{
                        placeholder: () => {
                            return "text-[0.9em]"
                        },
                    }}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 10,
                        colors: {
                            ...theme.colors,
                            primary25: "lightgray", //hover na opcija vo dropdown
                            primary50: "lightgray",
                            primary75: "lightgray",
                            primary: "gray", //selektirana opcija vo dropdown
                            neutral0: "#e0ebea", // bg na main
                            neutral10: "#f3f7f6", // bg na opcija external
                            neutral20: "#9DB5B2", //linii
                        },
                        spacing: {
                            ...theme.spacing,
                            baseUnit: 5,
                        }
                    })}
                />
            </div>

            <button className="mt-28 bg-opal self-center px-9 py-3 rounded-full text-xl" onClick={submit}>Create</button>
        </div>
    )
}