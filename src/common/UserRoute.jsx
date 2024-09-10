// src/App.js
import { Routes, BrowserRouter, Route } from "react-router-dom";
// import WelcomePage from "../components/WelcomePage";
import useDataStore from "../zustand/userDataStore";
import { ValidAuthroutes } from "./validRoute";
import { InvalidLoginRoutes } from "./invalidRoute";

function UserRoute() {
  const user = useDataStore((state) => state.user);
  console.log({ user })

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <>
            {ValidAuthroutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </>
        ) : (
          <>
            {InvalidLoginRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default UserRoute;