import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const Globe = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
      // default
      stroke="white"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g strokeDasharray="8 4" className="stroke-gray-300 dark:stroke-gray-100">
        <path d="M4.12803 28.9074C4.05502 24.0021 5.30155 19.1673 7.73723 14.9088C10.1729 10.6503 13.7082 7.12452 17.9733 4.70042C22.2385 2.27631 27.0766 1.04291 31.9817 1.12924C36.8869 1.21557 41.6786 2.61847 45.8558 5.19117" />
        <path d="M32.2565 55.8645C27.2295 56.0035 22.2613 54.755 17.8971 52.2561C13.533 49.7572 9.94154 46.1044 7.51689 41.6985" />
        <path d="M54.3144 13.3708C56.4699 16.6213 57.906 20.2948 58.5264 24.1453C59.1468 27.9959 58.9373 31.9345 57.9119 35.6975C56.8864 39.4605 55.0687 42.9609 52.5805 45.9643C50.0923 48.9677 46.9911 51.4048 43.4845 53.1122" />
      </g>

      <g style={{ animation: "custom-bounce 600ms infinite" }}>
        <rect x="2.5" y="32.25" width="5" height="6.66667" rx="2.5" />
        <path d="M5 40.1667V38.9167" />
        <path d="M4.16667 36.4167H2.91667" />
        <path d="M7.5 36.4167H6.66667" />
        <path d="M4.16667 34.75H2.91667" />
        <path d="M7.5 34.75H6.66667" />
      </g>
      <g style={{ animation: "custom-bounce 600ms infinite" }}>
        <rect x="48.5" y="5.25" width="5" height="6.66667" rx="2.5" />
        <path d="M51 13.1667V11.9167" />
        <path d="M50.1667 9.41666H48.9167" />
        <path d="M53.5 9.41666H52.6667" />
        <path d="M50.1667 7.75L48.9167 7.75" />
        <path d="M53.5 7.75L52.6667 7.75" />
      </g>
      <g style={{ animation: "custom-bounce 600ms infinite" }}>
        <rect x="35.5" y="51.25" width="5" height="6.66667" rx="2.5" />
        <path d="M38 59.1667V57.9167" />
        <path d="M37.1667 55.4167H35.9167" />
        <path d="M40.5 55.4167H39.6667" />
        <path d="M37.1667 53.75H35.9167" />
        <path d="M40.5 53.75H39.6667" />
      </g>
      <path d="M45.5 18.5L43.028 20.3128C42.685 20.5644 42.2706 20.7 41.8453 20.7H35.0016C34.236 20.7 33.5375 21.1371 33.2028 21.8256L32.6812 22.8987C32.2807 23.7226 32.4912 24.7134 33.1922 25.3033L39.1798 30.3422C40.7083 31.6285 41.4963 33.5912 41.2818 35.5773L40.8638 39.4469C40.7883 40.1459 40.6209 40.8319 40.3661 41.4872L39 45" />
      <path d="M15 25.8333L22.9067 24.4744C24.2593 24.2419 25.4388 25.4097 25.2199 26.7646L24.3517 32.1361C24.0757 33.8444 24.9293 35.5365 26.4673 36.3295L28.9036 37.5857C30.1339 38.2201 30.7704 39.6137 30.4443 40.9589L29.2222 46" />
      <circle cx="32" cy="29" r="17.5" />
    </svg>
  );
});

export default Globe;