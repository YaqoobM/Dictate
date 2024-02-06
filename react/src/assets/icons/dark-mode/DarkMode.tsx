import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const DarkMode = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 18 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M10.8105 12.5942C10.8189 10.4317 11.3888 8.30838 12.4644 6.43229C13.54 4.55621 15.0845 2.99165 16.9465 1.89186C15.5657 1.32021 14.0885 1.0175 12.5942 1C9.51922 1 6.57019 2.22153 4.39587 4.39587C2.22153 6.57019 1 9.51922 1 12.5942C1 15.6692 2.22153 18.6182 4.39587 20.7926C6.57019 22.9669 9.51922 24.1884 12.5942 24.1884C14.1066 24.1777 15.6026 23.8748 17 23.2965C15.128 22.2035 13.5729 20.6418 12.4876 18.7652C11.4024 16.8887 10.8244 14.7619 10.8105 12.5942Z" />
    </svg>
  );
});

export default DarkMode;
