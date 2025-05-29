import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const TravelerSelectIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <Path
      fill="#fff"
      stroke="#1C33FF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M11 21c5.523 0 10-4.477 10-10S16.523 1 11 1 1 5.477 1 11s4.477 10 10 10Z"
    />
    <Path
      fill="#fff"
      stroke="#1C33FF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M11.119 11.78a.963.963 0 0 0-.24 0 3.269 3.269 0 0 1-3.16-3.27c0-1.81 1.46-3.28 3.28-3.28a3.276 3.276 0 0 1 .12 6.55ZM17.74 18.38A9.934 9.934 0 0 1 11 21c-2.6 0-4.96-.99-6.74-2.62.1-.94.7-1.86 1.77-2.58 2.74-1.82 7.22-1.82 9.94 0 1.07.72 1.67 1.64 1.77 2.58Z"
    />
  </Svg>
);
export default TravelerSelectIcon;
