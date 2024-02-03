import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

const LogoutRequired: FC = () => {
  // const { user } = useAuth();
  // if (!user) {

  if (false) {
    // user is not authenticated
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default LogoutRequired;
