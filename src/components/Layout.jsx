// import Sidebar from "../common/sidebar";

import Footer from "./Footer";
import "../App.css";
import Navbar from "./Navbar";

function Layout({ children }) {
    return (
        <>
            <Navbar />
            <div className="mt-14">
                <div className="main-content">{children}</div>
                {/* <footer>this is footer</footer> */}
                <Footer />
            </div>
        </>
    );
}

export default Layout;
