import * as React from 'react';
import { Svg, Path, Rect } from 'react-native-svg';

const InviteIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={35}
    fill="none"
    viewBox="0 0 38 38"
    {...props}
  >
    <Rect width={36} height={36} x={0.5} y={0.5} stroke="#CCCEEC" rx={7.5} />
    <Path
      stroke="#2A2F5C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.545 18.62a3.81 3.81 0 1 0 0-7.62 3.81 3.81 0 0 0 0 7.62ZM24.09 27c0-2.948-2.934-5.333-6.545-5.333C13.933 21.667 11 24.052 11 27M30 13.5h-5M27.5 16v-5"
    />
  </Svg>
);
export default InviteIcon;
