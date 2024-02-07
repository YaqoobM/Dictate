import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const AddUser = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="#222222"
      strokeWidth="5"
      strokeLinecap="round"
    >
      <circle cx="29.1667" cy="23.3333" r="11.6667" />
      <path d="M46.0703 59.6373C45.0733 55.9162 42.8762 52.6281 39.82 50.283C36.7637 47.9378 33.019 46.6667 29.1666 46.6667C25.3143 46.6667 21.5696 47.9378 18.5133 50.283C15.457 52.6281 13.26 55.9162 12.2629 59.6373" />
      <path d="M55.4166 29.1667L55.4166 46.6667" />
      <path d="M64.1666 37.9167L46.6666 37.9167" />
    </svg>
  );
});

export default AddUser;
