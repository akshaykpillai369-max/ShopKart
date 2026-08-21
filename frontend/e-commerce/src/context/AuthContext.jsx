import { useState, createContext, useContext, useEffect} from "react";
import axios from "axios";
const AuthContext = createContext()

export const useLogin = () => useContext(AuthContext)

export default function AuthProvider({children}){

    const [access, setAccess] = useState()
    const [user, setUser] = useState(() => {
    return localStorage.getItem("shopkart_user")
})

    useEffect(() => {

        axios.post(
    'http://localhost:8000/api/token/refresh/',
    null,
    {
        withCredentials: true
    }
)

.then((response) => {
    setAccess(response.data.access)
})

}, [])

const login = (email, password) => {

    const data = {
        username: email,
        password: password
    }

    return axios.post(
        'http://localhost:8000/api/token/',
        data,
        {
            withCredentials: true
        }
    )
    .then((response) => {
        setAccess(response.data.access)

        const username = email.split("@")[0]
        setUser(username)

        localStorage.setItem("shopkart_user", username)
    })
}

//google_login
const googleLogin = (credential) => {
    return axios.post(
        "http://localhost:8000/api/auth/google/",
        {
            credential: credential
        },
    {
        withCredentials: true
    }
    )
    .then((response)=> {

        setAccess(response.data.access)
        const username = response.data.email.split("@")[0]
        setUser(username)

        localStorage.setItem("shopkart_user", username)
    })
}


// Logout
const logout = () => {
    setAccess()
    setUser()

    localStorage.removeItem("shopkart_user")
}
    
    return(
        <AuthContext value={{access, login, user, logout, googleLogin}}>
            {children}
        </AuthContext>
    )

}