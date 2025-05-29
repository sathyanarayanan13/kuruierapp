import * as React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';

const DropDown = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    viewBox="0 0 25 25"
    {...props}
  >
    <Circle cx={13} cy={12.818} r={12.816} fill="#EFF0FF" />
    <Path
      stroke="#5059A5"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m18.108 10.846-4.132 4.13a1.258 1.258 0 0 1-1.774 0l-4.131-4.13"
    />
  </Svg>
);
export default DropDown;
