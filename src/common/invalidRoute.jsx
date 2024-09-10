import { Navigate } from "react-router-dom";
import Login from "../components/LoginScreen";
import Register from "../components/RegisterPage";
import ForgotPassword from "../components/forgot-password";

export const InvalidLoginRoutes = [
    { path: "/*", element: <Navigate to="/login" replace={true} /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },

    { path: "/forgot-password", element: <ForgotPassword /> },
];
