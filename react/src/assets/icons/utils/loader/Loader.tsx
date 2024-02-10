import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const Loader = forwardRef<SVGSVGElement, Props>((props, ref) => {
  // <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
  return (
    <svg
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="#fff"
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18" />
        </g>
      </g>
    </svg>
  );
});

export default Loader;
