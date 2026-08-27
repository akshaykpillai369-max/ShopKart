import { useState, createContext, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useLogin = () => useContext(AuthContext)

export default function AuthProvider({ children }) {

    const [access, setAccess] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {

        axios
            .post(
                "http://localhost:8000/api/token/refresh/",
                null,
                {
                    withCredentials: true
                }
            )
            .then((response) => {
                setAccess(response.data.access)
            })
            .catch(() => {
                setAccess(null)
            })
            .finally(() => {
                setAuthLoading(false)
            })

    }, [])


    const login = (email, password) => {

        const data = {
            username: email,
            password: password,
        }

        return axios
            .post(
                "http://localhost:8000/api/token/",
                data,
                {
                    withCredentials: true,
                }
            )
            .then((response) => {

                setAccess(response.data.access)

            })
    }


    const googleLogin = (credential) => {

        return axios
            .post(
                "http://localhost:8000/api/auth/google/",
                {
                    credential: credential,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {

                setAccess(response.data.access)

            })
    }


    const logout = () => {

        return axios
            .post(
                "http://localhost:8000/api/logout/",
                null,
                {
                    withCredentials: true,
                }
            )
            .finally(() => {

                setAccess(null)

            })
    }


    const isLoggedIn = !!access


    return (
        <AuthContext
            value={{
                access,
                login,
                isLoggedIn,
                logout,
                googleLogin,
                authLoading
            }}
        >
            {children}
        </AuthContext>
    )
}