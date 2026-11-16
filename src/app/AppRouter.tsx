import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "../pages/HomePage/HomePage.tsx";
import LoginPage from "../pages/LoginPage/LoginPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.tsx";
import { AuthProvider } from "../contexts/AuthContext/AuthProvider.tsx";
import UsersList from "../pages/Users/UsersList/UsersList.tsx";
import PublicRoute from "../components/PublicRoute/PublicRoute.tsx";



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