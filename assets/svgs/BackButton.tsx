import * as React from "react"
import { Svg, Path, Rect } from 'react-native-svg';

const BackButton = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <Rect width={30} height={30} fill={props.rectFill || "#5A6BFF"} rx={10} />
    <Path
      stroke={props.stroke || "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m16.857 20.84-4.462-4.462a1.359 1.359 0 0 1 0-1.916L16.857 10"
    />
  </Svg>
)
export default BackButton
