import { FC, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  Close as ErrorIcon,
  Loader as LoadingIcon,
} from "../../../assets/icons/utils";
import { InputGroup } from "../../../components/forms";
import { Button, Card } from "../../../components/utils";
import { useSignUp } from "../../../hooks/auth";

const SignUp: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const { signUp, isPending, isError, error } = useSignUp();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // custom 'confirm password' validation
    let confirmPasswordValidation: string = "";

    if (!confirmPassword) {
      confirmPasswordValidation = "this field may not be blank.";
    }

    if (password !== confirmPassword) {
      confirmPasswordValidation = "passwords must match.";
    }

    // refresh validation errors
    if (confirmPasswordError) {
      setConfirmPasswordError("");
    }

    signUp(
      { email, username, password },
      {
        onSuccess: () => {
          if (confirmPasswordValidation) {
            return setConfirmPasswordError(confirmPasswordValidation);
          }

          console.log("navigate to home page");
        },

        onError: () => {
          if (confirmPasswordValidation) {
            return setConfirmPasswordError(confirmPasswordValidation);
          }
        },
      },
    );
  };

  return (
    <section className="px-2 py-10 sm:px-0 xl:py-20">
      <div className="mx-auto flex flex-col items-center justify-center py-8">
        <h1 className="mb-6 flex flex-row items-center gap-x-3 text-3xl font-semibold text-amber-500 dark:text-amber-300">
          <span>Sign Up</span>
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
            {isError &&
            error &&
            !error?.data?.email &&
            !error?.data?.username &&
            !error?.data?.password ? (
              <p className="block text-sm font-medium capitalize text-red-500">
                Something went wrong.
              </p>
            ) : (
              ""
            )}
            <form className="space-y-6" onSubmit={(e) => submit(e)}>
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
                id="username"
                name="username"
                type="text"
                value={username}
                setValue={setUsername}
                label="Username"
                placeholder="your username here..."
                error={error?.data?.username}
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
              <InputGroup
                id="confirm-password"
                name="confirm-password"
                type="password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                label="Confirm Password"
                placeholder="super secret password..."
                error={confirmPasswordError}
              />
              <Button className="w-full">Sign Up</Button>
              <p className="text-sm font-light tracking-tight text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-amber-500 hover:underline focus:border-b focus:border-amber-500 focus:outline-none dark:text-amber-300  dark:focus:border-amber-300"
                >
                  Log In
                </Link>
              </p>
            </form>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SignUp;
