import { useLogin } from "..";
import { useProfile } from "../../user";

const useAuth = () => {
  const { isSuccess } = useProfile();
  const { login } = useLogin();

  // todo: logout

  return { loggedIn: isSuccess, login };
};

export default useAuth;
