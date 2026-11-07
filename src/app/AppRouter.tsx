import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import HomePage from "../pages/HomePage/HomePage.tsx";
import LoginPage from "../pages/LoginPage/LoginPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.tsx";
import type React from "react";
import { useAuth } from "../contexts/AuthContext/useAuth.ts";
import { AuthProvider } from "../contexts/AuthContext/AuthProvider.tsx";
import UsersList from "../pages/Users/UsersList/UsersList.tsx";

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

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UsersList /></ProtectedRoute>}/>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        </Routes>
    )
}

function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRouter