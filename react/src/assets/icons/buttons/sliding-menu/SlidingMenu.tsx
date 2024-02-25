import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const SlidingMenu = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="black"
      strokeWidth="4"
      strokeLinecap="round"
    >
      <path d="M10.4167 14.5833H39.5834" />
      <path d="M10.4167 25H31.25" />
      <path d="M10.4167 35.4167H22.9167" />
    </svg>
  );
});

export default SlidingMenu;
