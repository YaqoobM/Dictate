import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Footer, NavigationBar } from "../../../components/page";

const Main: FC = () => {
  return (
    <>
      <header>
        <NavigationBar />
      </header>
      <main className="h-screen bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-gray-100">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Main;
