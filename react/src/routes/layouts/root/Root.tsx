import Cookies from "js-cookie";
import { FC } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useAxios } from "../../../hooks/utils";

const Root: FC = () => {
  const axios = useAxios();

  if (import.meta.env.DEV && Cookies.get("csrftoken") == undefined) {
    axios.get("/api/get_csrf_token/");
  }

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
};

export default Root;
