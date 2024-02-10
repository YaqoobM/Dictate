import { FC } from "react";
import { Link } from "react-router-dom";
import { Recorder as RecorderIcon } from "../../../assets/icons";

const Footer: FC = () => {
  return (
    <footer className="border-t-2 border-gray-200 bg-gray-800 bg-gradient-to-r from-gray-100 to-gray-200/95 dark:border-gray-800 dark:bg-gray-500 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            to="/home"
            className="mb-4 flex items-center space-x-3 border-b border-transparent focus:outline-none focus-visible:border-amber-500 dark:focus-visible:border-amber-300 sm:mb-0"
          >
            <span className="self-center whitespace-nowrap text-3xl font-medium dark:text-white">
              Dictate
            </span>
            <RecorderIcon
              className="mt-1 fill-amber-500 dark:fill-amber-300"
              height="23"
            />
          </Link>
          <ul className="mb-6 flex flex-wrap items-center gap-x-4 text-sm font-light text-gray-600 dark:text-gray-400 sm:mb-0 md:gap-x-6">
            <li>
              <Link
                to="#"
                className="border-b border-transparent hover:text-amber-500 focus:outline-none focus-visible:border-amber-500 hover:dark:text-amber-300 dark:focus-visible:border-amber-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="border-b border-transparent hover:text-amber-500 focus:outline-none focus-visible:border-amber-500 hover:dark:text-amber-300 dark:focus-visible:border-amber-300"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="border-b border-transparent hover:text-amber-500 focus:outline-none focus-visible:border-amber-500 hover:dark:text-amber-300 dark:focus-visible:border-amber-300"
              >
                Licensing
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="border-b border-transparent hover:text-amber-500 focus:outline-none focus-visible:border-amber-500 hover:dark:text-amber-300 dark:focus-visible:border-amber-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          © 2023{" "}
          <Link
            to="/home"
            className="border-b border-transparent hover:text-amber-500 focus:outline-none focus-visible:border-amber-500 hover:dark:text-amber-300 dark:focus-visible:border-amber-300"
          >
            Dictate
          </Link>
          ™. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
