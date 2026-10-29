import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "../pages/HomePage/HomePage.tsx";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter