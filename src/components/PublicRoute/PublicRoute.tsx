import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext/useAuth";

function PublicRoute({ children }: { children: React.ReactNode }) {
    const {isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Verificando sessão...</div>;
    }

    if (isAuthenticated) {
        const from = location.state?.from;

        const redirectTo =
            from?.pathname?.startsWith("/") && !from.pathname.startsWith("//")
                ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
                : "/";

        return <Navigate to={redirectTo} replace />;
    }

    return children;
}

export default PublicRoute;