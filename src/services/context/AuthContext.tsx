import { User, signOut } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/services/firebase/config"

type ReturnType = {
    Auth: User | null
    logout: (() => Promise<void>)
}


const initialState: ReturnType = {
    Auth: null,
    logout: (async () => { }),

}

const AuthContext = createContext<ReturnType>(initialState);
const AuthContextProvider = (props: any) => {

    const [Auth, setAuth] = useState<ReturnType["Auth"] | null>(null);
    const logout = async () => await signOut(auth).then(() => setAuth(null))




    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(async (userAuth) => {
            if (userAuth) {
                setAuth(userAuth as ReturnType["Auth"]);
            }
        });
        return () => subscriber();
    }, []);


    return (
        <AuthContext.Provider value={{
            Auth,
            logout,
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};
const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContextProvider;
export {
    AuthContext,
    useAuth,
}