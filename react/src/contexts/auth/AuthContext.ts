import { AxiosResponse } from "axios";
import { createContext } from "react";

type ContextValue = {
  isAuthenticated: boolean;
  checkingAuth: boolean;

  login: (
    email: string,
    password: string,
    options: { onSuccess?: () => void; onError?: () => void },
  ) => void;
  loginReset: () => void;
  loginIsPending: boolean;
  loginIsSuccess: boolean;
  loginIsError: boolean;
  loginError: AxiosResponse | null;

  logout: (options: { onSuccess?: () => void; onError?: () => void }) => void;
  logoutReset: () => void;
  logoutIsPending: boolean;
  logoutIsSuccess: boolean;
  logoutIsError: boolean;
  logoutError: AxiosResponse | null;

  signUp: (
    email: string,
    username: string,
    password: string,
    options: { onSuccess?: () => void; onError?: () => void },
  ) => void;
  signUpReset: () => void;
  signUpIsPending: boolean;
  signUpIsSuccess: boolean;
  signUpIsError: boolean;
  signUpError: AxiosResponse | null;
};

const defaultValue: ContextValue = {
  isAuthenticated: false,
  checkingAuth: false,

  login: () => {
    console.log("logging in user");
  },
  loginReset: () => {
    console.log("resetting login data and errors");
  },
  loginIsPending: false,
  loginIsSuccess: false,
  loginIsError: false,
  loginError: null,

  logout: () => {
    console.log("logging out user");
  },
  logoutReset: () => {
    console.log("resetting logout data and errors");
  },
  logoutIsPending: false,
  logoutIsSuccess: false,
  logoutIsError: false,
  logoutError: null,

  signUp: () => {
    console.log("signing up user");
  },
  signUpReset: () => {
    console.log("resetting sign-up data and errors");
  },
  signUpIsPending: false,
  signUpIsSuccess: false,
  signUpIsError: false,
  signUpError: null,
};

const AuthContext = createContext(defaultValue);

export default AuthContext;
