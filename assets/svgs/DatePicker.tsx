import * as React from "react"
import { Svg, Path } from 'react-native-svg';

const DatePicker = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={22}
    fill="none"
    viewBox="0 0 25 25"
    {...props}
  >
    <Path
      fill={props.pathFill || '#fff'}
      stroke={props.stroke || "#5059A5"}
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M6.056.973V3.93M13.944.973V3.93"
    />
    <Path
      fill={props.pathFill || '#fff'}
      stroke={props.stroke || "#5059A5"}
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M1.62 7.963H18.38M18.874 7.381v8.381c0 2.958-1.479 4.93-4.93 4.93H6.056c-3.451 0-4.93-1.972-4.93-4.93v-8.38c0-2.959 1.479-4.93 4.93-4.93h7.888c3.451 0 4.93 1.971 4.93 4.93Z"
    />
  </Svg>
)
export default DatePicker
