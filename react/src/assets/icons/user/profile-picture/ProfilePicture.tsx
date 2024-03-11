import { forwardRef, SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {}

const ProfilePicture = forwardRef<SVGSVGElement, Props>((props, ref) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
    >
      <path
        d="M25 100C25 58.5786 58.5786 25 100 25C141.421 25 175 58.5786 175 100C175 141.421 141.421 175 100 175C58.5786 175 25 141.421 25 100Z"
        fill="#D9D9D9"
      />
      <circle cx="100" cy="74.3333" r="33.3333" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M155.681 150.049C155.713 150.135 155.694 150.232 155.632 150.301C141.908 165.47 122.067 175 100 175C77.9336 175 58.0929 165.47 44.369 150.302C44.3071 150.233 44.2881 150.136 44.3198 150.05C51.7351 129.738 73.8599 115 100.001 115C126.141 115 148.266 129.738 155.681 150.049Z"
        fill="white"
      />
    </svg>
  );
});

export default ProfilePicture;
