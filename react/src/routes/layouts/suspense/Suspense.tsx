import { FC, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loading } from ".";

const Layout: FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
};

export default Layout;
