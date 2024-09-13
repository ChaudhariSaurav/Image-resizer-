import { Navigate } from "react-router-dom";
import NotFound from "../components/NotFound";
import WelcomePage from "../components/welcome";
import FetchFeedBack from "../components/FetchFeedBack";
import TransactionHistory from "../components/TransactionHistory";
import PdfResizer from "../components/PdfResizer";
import Profile from "../components/Profile";
// valid route define here


export const ValidAuthroutes = [
    { path: "/", element: <Navigate to="/welcome" replace={true} /> },
    { path: "/welcome", element: <WelcomePage/> },
    { path: "/pdf-resize", element: <PdfResizer/> },
    { path: "/feedback", element: <FetchFeedBack/> },
    { path: "/transaction-history", element: <TransactionHistory/> },
    { path: "/profile", element: <Profile/> },
    { path: "/*", element: <NotFound /> },
];