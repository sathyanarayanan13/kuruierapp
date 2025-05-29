import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const WeightIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={22}
    fill="none"
    viewBox="0 0 25 25"
    {...props}
  >
    <Path
      fill="#FFFCDD"
      stroke="#55559D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M6.085 4.176a3.176 3.176 0 1 0 6.353 0 3.176 3.176 0 0 0-6.353 0Z"
    />
    <Path
      fill="#FFFCDD"
      stroke="#55559D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M3.792 7.353H14.73a1.059 1.059 0 0 1 1.042.869l1.733 9.53A1.058 1.058 0 0 1 16.463 19H2.06a1.058 1.058 0 0 1-1.042-1.249l1.733-9.53a1.059 1.059 0 0 1 1.042-.868Z"
    />
  </Svg>
);
export default WeightIcon;
