import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const LightMode = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="#222222"
      stroke-width="2"
      stroke-linecap="round"
    >
      <circle cx="17.5" cy="17.5" r="4.83333" />
      <path d="M17.5 7.29167V4.375" />
      <path d="M17.5 30.625V27.7083" />
      <path d="M24.7185 10.2812L26.7809 8.21878" />
      <path d="M8.21928 26.7814L10.2817 24.719" />
      <path d="M27.7083 17.5L30.625 17.5" />
      <path d="M4.37499 17.5L7.29166 17.5" />
      <path d="M24.7185 24.7188L26.7809 26.7812" />
      <path d="M8.21928 8.21858L10.2817 10.281" />
    </svg>
  );
});

export default LightMode;
