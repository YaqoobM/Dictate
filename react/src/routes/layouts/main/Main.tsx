import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Footer, NavigationBar } from "../../../components/page";

const Main: FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex-none">
        <NavigationBar />
      </header>
      <main className="flex grow bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-gray-100">
        <Outlet />
      </main>
      <footer className="flex-none">
        <Footer />
      </footer>
    </div>
  );
};

export default Main;
