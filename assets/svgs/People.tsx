import * as React from "react"
import { Svg, Path } from 'react-native-svg';

const People = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <Path
      stroke="#5059A5"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M9.141 10a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM16.872 20c0-3.483-3.465-6.3-7.731-6.3S1.41 16.517 1.41 20"
    />
  </Svg>
)
export default People
