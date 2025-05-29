import * as React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';

const NextIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <Circle
      cx={11}
      cy={11}
      r={11}
      fill="#6C74B7"
      transform="rotate(-90 11 11)"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m9.139 6.876 3.546 3.545a1.08 1.08 0 0 1 0 1.523L9.139 15.49"
    />
  </Svg>
);
export default NextIcon;
