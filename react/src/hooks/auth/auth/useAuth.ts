import { useLogin, useLogout } from "..";
import { useProfile } from "../../user";

const useAuth = () => {
  const { isSuccess } = useProfile();
  const { login } = useLogin();
  const { logout } = useLogout();

  return { loggedIn: isSuccess, login, logout };
};

export default useAuth;
