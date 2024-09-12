import { Navigate } from "react-router-dom";
import Login from "../components/LoginScreen";
import Register from "../components/RegisterPage";
import ForgotPassword from "../components/forgot-password";
import HomePage from "../components/HomePage";

export const InvalidLoginRoutes = [
    { path: "/*", element: <Navigate to="/home" replace={true} /> },
    { path: "/home", element: <HomePage /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
];
