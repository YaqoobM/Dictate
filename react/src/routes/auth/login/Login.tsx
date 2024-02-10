import { FC, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Error as ErrorIcon } from "../../../assets/icons/symbols";
import { Loader as LoadingIcon } from "../../../assets/icons/utils";
import { InputGroup } from "../../../components/forms";
import { Button, Card } from "../../../components/utils";
import { useLogin } from "../../../hooks/auth";

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, isPending, isError, error } = useLogin();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: () => {
          console.log("navigate to home page");
        },
      },
    );
  };

  return (
    <section className="px-2 py-10 sm:px-0 xl:py-20">
      <div className="mx-auto flex flex-col items-center justify-center py-8">
        <h1 className="mb-6 flex flex-row items-center gap-x-3 text-3xl font-semibold text-amber-500 dark:text-amber-300">
          <span>Login</span>
          {isPending ? (
            <LoadingIcon
              className="animate-spin stroke-amber-500 dark:stroke-amber-300"
              height="26"
            />
          ) : isError ? (
            <ErrorIcon className="stroke-red-600" height="26" />
          ) : (
            ""
          )}
        </h1>
        <Card>
          <div className="space-y-6 p-8">
            {error?.data?.credentials ? (
              <p className="block text-sm font-medium capitalize text-red-500">
                {error.data.credentials}
              </p>
            ) : (
              ""
            )}
            <form className="space-y-6" onSubmit={submit}>
              <InputGroup
                id="email"
                name="email"
                type="email"
                value={email}
                setValue={setEmail}
                label="Email"
                placeholder="your email here..."
                error={error?.data?.email}
              />
              <InputGroup
                id="password"
                name="password"
                type="password"
                value={password}
                setValue={setPassword}
                label="Password"
                placeholder="super secret password..."
                error={error?.data?.password}
              />
              <Button className="w-full">Log In</Button>
              <p className="text-sm font-light tracking-tight text-gray-500">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-amber-500 hover:underline focus:border-b focus:border-amber-500 focus:outline-none dark:text-amber-300  dark:focus:border-amber-300"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Login;
