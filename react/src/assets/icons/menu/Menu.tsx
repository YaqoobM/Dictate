import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const Menu = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M5 7H19" />
      <path d="M5 12H19" />
      <path d="M5 17H19" />
    </svg>
  );
});

export default Menu;
