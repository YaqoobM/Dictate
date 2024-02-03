import { FC } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

const Root: FC = () => {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
};

export default Root;
