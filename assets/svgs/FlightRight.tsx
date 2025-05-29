import * as React from "react"
import { Svg, Path } from 'react-native-svg';

const FlightRight = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={20}
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <Path
      stroke={props.stroke || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m1.11 7.04 1.96 2.33c.3.35.3.93 0 1.28l-1.96 2.33c-.27.54 0 1.2.58 1.4l1.33.44c.32.11.79 0 1.03-.24l2.28-2.27c.16-.17.48-.3.71-.3h2.85c.42 0 .62.31.46.7l-2.12 4.91c-.33.77.08 1.4.92 1.4h1.29c.67 0 1.44-.5 1.7-1.12l2.41-5.59c.07-.16.28-.3.46-.3h3c.94 0 2.05-.69 2.48-1.53.15-.3.15-.65 0-.95C20.06 8.69 18.94 8 18 8h-3c-.18 0-.39-.14-.46-.3l-2.41-5.58C11.88 1.5 11.11 1 10.44 1H9.15c-.84 0-1.25.63-.92 1.4l2.12 4.91c.17.38-.04.7-.46.7H7.04c-.23 0-.55-.13-.71-.29L4.05 5.45c-.24-.24-.7-.35-1.03-.24l-1.33.44c-.58.18-.86.84-.58 1.39Z"
    />
  </Svg>
)
export default FlightRight
