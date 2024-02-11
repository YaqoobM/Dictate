import { FC, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../contexts";

const LogoutRequired: FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default LogoutRequired;
