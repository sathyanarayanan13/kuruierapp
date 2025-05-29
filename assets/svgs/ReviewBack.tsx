import * as React from 'react';
import { Svg, Path, Rect } from 'react-native-svg';

const ReviewBack = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <Rect
      width={29}
      height={29}
      x={0.5}
      y={0.5}
      fill="#fff"
      stroke="#E2E4FF"
      rx={9.5}
    />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m16.857 20.84-4.462-4.462a1.359 1.359 0 0 1 0-1.916L16.857 10"
    />
  </Svg>
);
export default ReviewBack;
