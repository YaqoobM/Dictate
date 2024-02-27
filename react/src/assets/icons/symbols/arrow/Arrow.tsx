import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const Arrow = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 34 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="black"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M21.494 2L32.1006 12.6066" />
      <path d="M21.494 23.6066L32.1006 13" />
      <path d="M2 13H32" />
    </svg>
  );
});

export default Arrow;
