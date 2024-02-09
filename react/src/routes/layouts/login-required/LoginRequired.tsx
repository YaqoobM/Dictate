import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../hooks/auth";

const LoginRequired: FC = () => {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default LoginRequired;
