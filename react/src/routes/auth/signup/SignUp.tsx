import { FC, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { InputGroup } from "../../../components/forms";
import { Button, Card } from "../../../components/utils";

const SignUp: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("button click");
  };

  return (
    <section className="px-2 py-10 sm:px-0 xl:py-20">
      <div className="mx-auto flex flex-col items-center justify-center py-8">
        <h1 className="mb-6 text-3xl font-semibold text-amber-500 dark:text-amber-300">
          Login
        </h1>
        <Card>
          <div className="space-y-6 p-8">
            <p className="block text-sm font-medium text-red-500 dark:font-semibold">
              Error
            </p>
            <form className="space-y-6" onSubmit={(e) => submit(e)}>
              <InputGroup
                id="email"
                name="email"
                type="email"
                value={email}
                setValue={setEmail}
                label="Email"
                placeholder="your email here..."
                error="error"
              />
              <InputGroup
                id="username"
                name="username"
                type="text"
                value={username}
                setValue={setUsername}
                label="Username"
                placeholder="your username here..."
                error="error"
              />
              <InputGroup
                id="password"
                name="password"
                type="password"
                value={password}
                setValue={setPassword}
                label="Password"
                placeholder="super secret password..."
                error="error"
              />
              <InputGroup
                id="confirm-password"
                name="confirm-password"
                type="password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                label="Confirm Password"
                placeholder="super secret password..."
                error="error"
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
