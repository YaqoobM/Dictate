import { FC } from "react";
import { Link } from "react-router-dom";
import { AddUser } from "../../../assets/icons";
import { Button, Card } from "../../../components/utils";

const SignUp: FC = () => {
  return (
    <Card
      title={
        <>
          <AddUser
            className="mr-4 stroke-amber-400 dark:stroke-amber-300"
            height="40px"
          />
          Sign Up
        </>
      }
      className="px-2 pt-10 sm:px-0 xl:pt-20"
    >
      <div className="space-y-6 p-8">
        <p className="block text-sm font-medium text-red-500">Error</p>
        <form className="space-y-6" method="post">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium tracking-tight text-gray-900"
            >
              Username <span className="text-red-500">*</span>
              <span className="float-right leading-tight tracking-tight text-red-500">
                error
              </span>
            </label>
            <input
              id="text"
              name="username"
              type="username"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium tracking-tight text-gray-900"
            >
              Email <span className="text-red-500">*</span>
              <span className="float-right leading-tight tracking-tight text-red-500">
                error
              </span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium tracking-tight text-gray-900"
            >
              Password <span className="text-red-500">*</span>
              <span className="float-right leading-tight tracking-tight text-red-500">
                error
              </span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
          <Button className="w-full">Sign Up</Button>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Sign Up
          </button>
          <p className="text-sm font-light text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </Card>
  );

  return (
    <section className="px-2 pt-10 sm:px-0 xl:pt-20">
      <div className="mx-auto flex flex-col items-center justify-center py-8">
        <h1 className="mb-6 flex items-center text-3xl font-semibold text-amber-400 dark:text-amber-300">
          <img
            className="mr-2 h-9 w-9"
            // src="{% static 'api/newspaper-dark.svg' %}"
            alt="_"
            height="2.25rem"
            width="2.25rem"
          />
          Sign Up
        </h1>
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="space-y-6 p-8">
            <p className="block text-sm font-medium text-red-500">Error</p>
            <form className="space-y-6" method="post">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium tracking-tight text-gray-900"
                >
                  Username <span className="text-red-500">*</span>
                  <span className="float-right leading-tight tracking-tight text-red-500">
                    error
                  </span>
                </label>
                <input
                  id="text"
                  name="username"
                  type="username"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium tracking-tight text-gray-900"
                >
                  Email <span className="text-red-500">*</span>
                  <span className="float-right leading-tight tracking-tight text-red-500">
                    error
                  </span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium tracking-tight text-gray-900"
                >
                  Password <span className="text-red-500">*</span>
                  <span className="float-right leading-tight tracking-tight text-red-500">
                    error
                  </span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <Button className="w-full">Sign Up</Button>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Sign Up
              </button>
              <p className="text-sm font-light text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Log In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
