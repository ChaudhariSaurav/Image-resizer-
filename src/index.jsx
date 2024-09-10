import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "./components/Layout.jsx";
import UserRoute from "./common/UserRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ChakraProvider>
			<Layout>
				<UserRoute />
			</Layout>
		</ChakraProvider>
	</React.StrictMode>,
);
