import * as React from "react"
import { Svg, Path } from 'react-native-svg';

const CameraIcon = (props: any) => (
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
      d="M6.718 22.113h10.414c2.743 0 3.836-1.68 3.965-3.727l.517-8.208a3.73 3.73 0 0 0-3.727-3.966 1.633 1.633 0 0 1-1.44-.884l-.716-1.44c-.457-.905-1.65-1.65-2.663-1.65h-2.276c-1.023 0-2.216.745-2.673 1.65l-.716 1.44a1.633 1.633 0 0 1-1.44.885 3.73 3.73 0 0 0-3.727 3.965l.517 8.208c.119 2.047 1.222 3.727 3.965 3.727ZM10.434 8.2h2.982"
    />
    <Path
      stroke="#2A2F5C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.925 18.137c1.779 0 3.23-1.45 3.23-3.23 0-1.778-1.451-3.229-3.23-3.229a3.236 3.236 0 0 0-3.23 3.23c0 1.779 1.451 3.23 3.23 3.23Z"
    />
  </Svg>
)
export default CameraIcon
