import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const Close = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="white"
      strokeWidth="2"
    >
      <path d="M9.27728 9.52728L28.7227 28.9727" />
      <path d="M9.27728 28.9727L28.7227 9.52728" />
    </svg>
  );
});

export default Close;
