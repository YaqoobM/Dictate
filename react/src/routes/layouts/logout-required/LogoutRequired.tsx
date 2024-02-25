import { FC, useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts";

const LogoutRequired: FC = () => {
  const { isAuthenticated, checkingAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingAuth && isAuthenticated) {
      navigate("/home");
    }
  }, [checkingAuth]);

  return <Outlet />;
};

export default LogoutRequired;
