import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../api/localStorage/auth";
import { AuthContext } from "../../authStore/store";

export default function LoadingScreen() {
    
    const navigate = useNavigate();
    const { setUserData } = useContext(AuthContext);

    React.useEffect(() => {

        let data = getUser();

        if(!data)
            return navigate("/login")

        setUserData(JSON.parse(data));
        console.log(JSON.parse(data))
        navigate("/home")
    }, [setUserData, navigate]);

    return null;
}