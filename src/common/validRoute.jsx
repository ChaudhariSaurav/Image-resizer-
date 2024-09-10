import { Navigate } from "react-router-dom";
import NotFound from "../components/NotFound";
import WelcomePage from "../components/welcome";
// valid route define here


export const ValidAuthroutes = [
    { path: "/", element: <Navigate to="/welcome" replace={true} /> },
    { path: "/welcome/", element: <WelcomePage/> },
    { path: "/*", element: <NotFound /> },
];