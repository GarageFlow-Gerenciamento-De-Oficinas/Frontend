import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext/useAuth";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Verificando sessão...</div>
    }

    if(!isAuthenticated) {
        return <Navigate to="/login"
        state={{from: location}}
        replace />
    }

    return children;
}

export default ProtectedRoute