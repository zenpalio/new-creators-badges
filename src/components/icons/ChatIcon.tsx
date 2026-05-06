import { SVGProps } from "react";

const ChatIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 13 13"
    className={className}
    {...props}
  >
    <path
      fill="currentColor"
      d="M11.378 9.255a3.75 3.75 0 0 0-2.93-5.352 3.75 3.75 0 1 0-6.827 3.102l-.34 1.158a.75.75 0 0 0 .931.932l1.158-.341c.372.178.77.295 1.18.344a3.75 3.75 0 0 0 5.079 1.906l1.158.34a.75.75 0 0 0 .932-.93zM3.406 7.977a.4.4 0 0 0-.106.015L2 8.375l.383-1.3a.38.38 0 0 0-.03-.282 3 3 0 1 1 1.231 1.23.4.4 0 0 0-.178-.046m7.209 1.347L11 10.626l-1.302-.383a.38.38 0 0 0-.28.029 3 3 0 0 1-4.026-1.166 3.747 3.747 0 0 0 3.297-4.4 3 3 0 0 1 1.957 4.335.38.38 0 0 0-.03.283z"
    />
  </svg>
);

export default ChatIcon;
