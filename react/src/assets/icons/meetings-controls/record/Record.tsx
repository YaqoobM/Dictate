import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const Record = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 57 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="black"
      strokeWidth="3"
    >
      <path d="M2 19.0745C2 17.765 2 17.1103 2.15185 16.575C2.53047 15.2403 3.57366 14.1971 4.90835 13.8185C5.44361 13.6667 6.09834 13.6667 7.4078 13.6667V13.6667C8.24844 13.6667 8.66876 13.6667 9.05226 13.591C10.001 13.4038 10.8498 12.8792 11.4416 12.1143C11.6808 11.8052 11.8687 11.4292 12.2447 10.6773L15.4778 4.21115C16.0157 3.13531 16.2846 2.5974 16.7679 2.2987C17.2512 2 17.8527 2 19.0555 2H37.4445C38.6473 2 39.2488 2 39.7321 2.2987C40.2154 2.5974 40.4843 3.13531 41.0222 4.21115L44.2553 10.6773C44.6313 11.4292 44.8192 11.8052 45.0584 12.1143C45.6502 12.8792 46.499 13.4038 47.4477 13.591C47.8312 13.6667 48.2516 13.6667 49.0922 13.6667V13.6667C50.4017 13.6667 51.0564 13.6667 51.5917 13.8185C52.9263 14.1971 53.9695 15.2403 54.3482 16.575C54.5 17.1103 54.5 17.765 54.5 19.0745V42.6667C54.5 45.4951 54.5 46.9093 53.6213 47.788C52.7426 48.6667 51.3284 48.6667 48.5 48.6667H8C5.17157 48.6667 3.75736 48.6667 2.87868 47.788C2 46.9093 2 45.4951 2 42.6667V19.0745Z" />
      <circle cx="28" cy="28" r="13" />
    </svg>
  );
});

export default Record;
