import { FC, ReactNode } from "react";

import { Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

type Props = {
  children: ReactNode;
};

const ProtectedRoute: FC<Props> = ({ children }) => {
  // const { user } = useAuth();
  // if (!user) {
  if (false) {
    //   // user is not authenticated
    return <Navigate to="/home" />;
  }
  return children;
};

export default ProtectedRoute;
