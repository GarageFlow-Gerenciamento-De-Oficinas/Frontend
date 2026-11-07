import type { ReactNode } from "react";
import { getAccessToken } from "../../services/authService";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = getAccessToken();

    if(!token) {
        return <Navigate to="/login" replace />
    }

    return children;
}

export default ProtectedRoute