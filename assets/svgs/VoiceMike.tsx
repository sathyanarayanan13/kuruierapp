import * as React from "react"
import { Svg, Path } from 'react-native-svg';

const VoiceMike = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={20}
    fill="none"
    viewBox="0 0 25 25"
    {...props}
  >
    <Path
      stroke="#2A2F5C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.768 17.35a4.769 4.769 0 0 0 4.77-4.771V6.02a4.769 4.769 0 0 0-4.77-4.77 4.769 4.769 0 0 0-4.77 4.77v6.559a4.769 4.769 0 0 0 4.77 4.77Z"
    />
    <Path
      stroke="#2A2F5C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M1.645 10.375v2.027c0 5.033 4.09 9.123 9.122 9.123 5.033 0 9.123-4.09 9.123-9.123v-2.027M9.11 6.532a4.802 4.802 0 0 1 3.315 0M9.813 9.062a3.742 3.742 0 0 1 1.92 0M10.767 21.523V25.1"
    />
  </Svg>
)
export default VoiceMike
