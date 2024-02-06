import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  strokeColor?: string;
}

const Menu = forwardRef<SVGSVGElement, Props>(
  ({ strokeColor, ...props }, ref) => {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
        {...props}
      >
        <path
          d="M5 7H19"
          stroke={strokeColor ? strokeColor : "black"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M5 12H19"
          stroke={strokeColor ? strokeColor : "black"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M5 17H19"
          stroke={strokeColor ? strokeColor : "black"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  },
);

export default Menu;
