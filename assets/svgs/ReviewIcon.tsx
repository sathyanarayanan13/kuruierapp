import * as React from "react"
import { Svg, Path } from 'react-native-svg';

const ReviewIcon = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={22}
    fill="none"
    viewBox="0 0 25 25"
    {...props}
  >
    <Path
      stroke="#75758E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M5.5 1v2.7M12.7 1v2.7M1.45 7.38h15.3M17.2 6.85v7.65c0 2.7-1.35 4.5-4.5 4.5H5.5C2.35 19 1 17.2 1 14.5V6.85c0-2.7 1.35-4.5 4.5-4.5h7.2c3.15 0 4.5 1.8 4.5 4.5Z"
    />
  </Svg>
)
export default ReviewIcon
