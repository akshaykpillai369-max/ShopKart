import { Navigate } from "react-router-dom";
import { useLogin } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

    const { user } = useLogin();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}