import React from "react";
import { AuthContext } from "../authStore/store";
import { StoreProvider } from "../store/StoreProvider";
import { useNavigate } from "react-router-dom";
import HomeScreen from "./home";

export default function Main(): JSX.Element {
    const navigate = useNavigate()
    const { data } = React.useContext(AuthContext)

    React.useEffect(() => {
        if (!data) {
            navigate("/")
        }
    }, [data, navigate])

    if (!data) {
        return <></>
    }
    console.log("avtenticiran e", data)

    return (
        <StoreProvider userId={data.id}>
            <HomeScreen />
        </StoreProvider>
    )
}