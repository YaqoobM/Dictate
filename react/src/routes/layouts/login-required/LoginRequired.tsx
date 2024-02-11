import { FC, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../contexts";

const LoginRequired: FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default LoginRequired;
