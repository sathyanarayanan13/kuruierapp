import * as React from "react"
import { Svg, Path } from 'react-native-svg';

const Mail = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={20}
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <Path
      stroke="#5059A5"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M16 18.5H6c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z"
    />
    <Path
      stroke="#5059A5"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m16 7-3.13 2.5c-1.03.82-2.72.82-3.75 0L6 7"
    />
  </Svg>
)
export default Mail
