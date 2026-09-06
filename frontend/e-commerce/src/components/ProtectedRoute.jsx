import { Navigate } from "react-router-dom"
import { useLogin } from "../context/AuthContext"

export default function ProtectedRoute({ children }) {

    const { isLoggedIn, authLoading } = useLogin()

    if (authLoading) {
        return null
    }

    if (!isLoggedIn) {
        return <Navigate to="/login"/>
    }

    return children
}