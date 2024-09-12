import { Navigate } from "react-router-dom";
import NotFound from "../components/NotFound";
import WelcomePage from "../components/welcome";
import FetchFeedBack from "../components/FetchFeedBack";
// valid route define here


export const ValidAuthroutes = [
    { path: "/", element: <Navigate to="/welcome" replace={true} /> },
    { path: "/welcome", element: <WelcomePage/> },
    { path: "/feedback", element: <FetchFeedBack/> },
    { path: "/*", element: <NotFound /> },
];