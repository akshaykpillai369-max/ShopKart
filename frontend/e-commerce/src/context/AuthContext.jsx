import { useState, createContext, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useLogin = () => useContext(AuthContext)

const API = "http://localhost:8000"

export default function AuthProvider({ children }) {
    const [access, setAccess] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [profile, setProfile] = useState(null)

    const fetchProfile = async (token) => {
        const response = await axios.get(
            `${API}/api/profile/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        setProfile(response.data)

        return response.data
    }

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post(
                `${API}/api/token/refresh/`,
                null,
                {
                    withCredentials: true,
                }
            )

            const newAccess = response.data.access

            setAccess(newAccess)

            return newAccess
        } catch (error) {
            setAccess(null)
            setProfile(null)

            throw error
        }
    }

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const token = await refreshAccessToken()

                await fetchProfile(token)
            } catch (error) {
                setAccess(null)
                setProfile(null)
            } finally {
                setAuthLoading(false)
            }
        }

        restoreSession()
    }, [])

    const login = async (email, password) => {
        const response = await axios.post(
            `${API}/api/token/`,
            {
                username: email,
                password: password,
            },
            {
                withCredentials: true,
            }
        )

        const token = response.data.access

        setAccess(token)

        await fetchProfile(token)

        return response
    }

    const googleLogin = async (credential) => {
        const response = await axios.post(
            `${API}/api/auth/google/`,
            {
                credential: credential,
            },
            {
                withCredentials: true,
            }
        )

        const token = response.data.access

        setAccess(token)

        await fetchProfile(token)

        return response
    }

    const logout = async () => {
        try {
            await axios.post(
                `${API}/api/logout/`,
                null,
                {
                    withCredentials: true,
                }
            )
        } finally {
            setAccess(null)
            setProfile(null)
        }
    }

    useEffect(() => {
        if (!access) {
            return
        }

        const interval = setInterval(
            async () => {
                try {
                    const newToken = await refreshAccessToken()

                    await fetchProfile(newToken)
                } catch (error) {
                    console.error(
                        "Automatic token refresh failed:",
                        error
                    )
                }
            },
            4 * 60 *  1000
        )

        return () => clearInterval(interval)
    }, [access])

    const isLoggedIn = !!access

    return (
        <AuthContext
            value={{
                access,
                login,
                isLoggedIn,
                logout,
                googleLogin,
                authLoading,
                profile,
                refreshAccessToken,
            }}
        >
            {children}
        </AuthContext>
    )
}