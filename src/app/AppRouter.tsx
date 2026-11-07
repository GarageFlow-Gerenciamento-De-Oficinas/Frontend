import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import HomePage from "../pages/HomePage/HomePage.tsx";
import LoginPage from "../pages/LoginPage/LoginPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.tsx";
import type React from "react";
import { useAuth } from "../contexts/AuthContext/useAuth.ts";
import { AuthProvider } from "../contexts/AuthContext/AuthProvider.tsx";

function PublicRoute({ children }: { children: React.ReactNode }) {
    const {isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Verificando sessão...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
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