import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../authStore/store";
import { registerUser } from "../../api/auth";
import { saveUser } from "../../api/localStorage/auth";

export default function DiscordAuthScreen() {

    const navigate = useNavigate();
    const { setUserData } = useContext(AuthContext);

    React.useEffect(() => {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
		const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

		if (!accessToken) {
            alert("njemit")
            return
		}

        authWithDiscord({accessToken, tokenType}, async (data: Store.User) => {
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
        });
    }, [navigate, setUserData])

    return (
        <div className="flex flex-1 w-screen h-screen items-center justify-center bg-light-cyan text-olive">
            Redirecting...
        </div>
    );
}


type Tokens = {
    accessToken?: string,
    tokenType: string | null
}

async function authWithDiscord(tokens: Tokens, callback: (data: Store.User) => void) {
    
    let req = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokens.tokenType} ${tokens.accessToken}`,
        },
    })

    let res = await req.json()
    console.log(res)

    callback({
        id: res.id,
        username: res.username,
        photo: "https://cdn.discordapp.com/avatars/" + res.id + "/" + res.avatar + ".png",
        firstName: res.username,
        lastName: "",
        lastUpdated: 0,
    })
}