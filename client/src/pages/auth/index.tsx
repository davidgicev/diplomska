import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../authStore/store";
import { useGoogleLogin } from "@react-oauth/google";
import { BsDiscord, BsGoogle } from "react-icons/bs";
import { registerUser } from "../../api/auth";
import { saveUser } from "../../api/localStorage/auth";

const discordAuthPath = "https://discord.com/api/oauth2/authorize?client_id=1002494739179913226&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord&response_type=token&scope=identify"

export default function AuthScreen() {

    const navigate = useNavigate();
    const { setUserData } = useContext(AuthContext);
    const inputRef:React.RefObject<HTMLInputElement> = React.createRef();

    const login = async (data: Store.User) => {
        const result = await registerUser({
            ...data,
            lastUpdated: 0,
        })
        if (!result) {
            return
        }
        const { id, token } = result
        const savedUser = { id, token, username: data.username }
        setUserData(savedUser)
        saveUser(savedUser)
        navigate("/home")
    }

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` },
            })
            const data = await userInfo.json();
            login({
                id: -1,
                firstName: data.given_name,
                lastName: data.family_name,
                photo: data.picture,
                username: data.name,
                lastUpdated: 0,
            })
        },
    });

    return (
        <div className="flex items-center justify-center flex-col bg-olive h-screen w-screen">
            <div className="px-10 py-14 flex flex-col items-center bg-mint-cream rounded-xl">
                <p className="text-3xl mb-6 text-gray-800">Authentication</p>
                <div className="mt-8 cursor-pointer bg-opal px-6 py-4 rounded-full flex items-center" onClick={() => loginWithGoogle()}>
                    <BsGoogle className="inline mr-4" size={20} />
                    <div>Login with Google</div>
                </div>
                <a className="mt-4 cursor-pointer bg-opal px-6 py-4 rounded-full flex items-center" href={discordAuthPath}>
                    <BsDiscord className="inline mr-4" size={20} />
                    <div>Login with Discord</div>
                </a>
                <div className="flex flex-row items-center justify-around w-[100%] my-5">
                    <div className="flex-1 h-0.5 bg-olive opacity-25" />
                    <p className="text-gray-700 my-5 mx-5">or</p>
                    <div className="flex-1 h-0.5 bg-olive opacity-25" />
                </div>
                <p className="text-lg">With username (don't)</p>
                <input ref={inputRef} className="bg-light-cyan border-opal border-2 rounded-xl p-2 m-2" />
                {/* <button onClick={submit} className="px-8 py-3 my-5 mt-3 bg-nickel rounded-full text-mint-cream text-lg" >Login</button> */}
            </div>
        </div>
    );
}