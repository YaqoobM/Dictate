import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const Exit = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 43 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="black"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M6.10196 37.5647C9.01556 40.4783 12.7277 42.4625 16.769 43.2664C20.8102 44.0702 24.9991 43.6577 28.8059 42.0808C32.6127 40.504 35.8664 37.8337 38.1556 34.4077C40.4448 30.9817 41.6667 26.9538 41.6667 22.8333C41.6667 18.7129 40.4448 14.685 38.1556 11.259C35.8664 7.83293 32.6127 5.16267 28.8059 3.58584C24.9991 2.00902 20.8102 1.59645 16.769 2.40031C12.7277 3.20416 9.01556 5.18835 6.10196 8.10194" />
      <path d="M16.494 11.8663L27.1006 22.4729" />
      <path d="M16.494 33.4729L27.1006 22.8663" />
      <path d="M2 22.5H27" />
    </svg>
  );
});

export default Exit;
