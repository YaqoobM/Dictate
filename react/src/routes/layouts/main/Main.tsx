import { FC } from "react";
import { Outlet } from "react-router-dom";

const Main: FC = () => {
  return (
    <>
      <nav>Navbar</nav>
      <Outlet />
    </>
  );
};

export default Main;
