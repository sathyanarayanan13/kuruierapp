import * as React from "react"
import { Svg, Path } from 'react-native-svg';

const ProfileIcon = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={23}
    fill="none"
    viewBox="0 0 18 28"
    {...props}
  >
    <Path
      stroke="#4B507E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M9.59 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM18.18 22c0-3.87-3.85-7-8.59-7S1 18.13 1 22"
    />
  </Svg>
)
export default ProfileIcon
