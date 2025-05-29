import * as React from "react"
import { Svg, Path } from 'react-native-svg';

const EyeIcon = (props: any) => (
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
      d="M14.58 10c0 1.98-1.6 3.58-3.58 3.58S7.42 11.98 7.42 10 9.02 6.42 11 6.42s3.58 1.6 3.58 3.58Z"
    />
    <Path
      stroke="#5059A5"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M11 18.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z"
    />
  </Svg>
)
export default EyeIcon
