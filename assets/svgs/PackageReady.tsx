import * as React from "react"
import { Svg, Path, Defs, Stop, LinearGradient } from 'react-native-svg';

const PackageReady = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={93}
    height={95}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M89.881 20.876c5.664 10.738 2.832 30.066-2.283 43.583-5.116 13.517-12.607 21.223-20.554 25.897-7.948 4.548-16.352 6.064-27.132 3.158-10.87-2.779-24.025-10.106-32.247-27.918-8.13-17.939-11.144-46.362-2.283-58.11C14.242-4.39 34.979.536 52.427 4.2c17.54 3.537 31.79 5.81 37.454 16.675Z"
    />
    <Path
      fill="#fff"
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.8}
      d="M72.333 59.76c.053 2-.48 3.893-1.44 5.52a10.09 10.09 0 0 1-2.053 2.56c-1.84 1.706-4.267 2.746-6.96 2.826a10.553 10.553 0 0 1-9.227-4.986A10.378 10.378 0 0 1 51 60.213c-.08-3.36 1.413-6.4 3.813-8.4 1.813-1.494 4.107-2.427 6.613-2.48C67.32 49.2 72.2 53.866 72.333 59.76Z"
    />
    <Path
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="m57.506 60.08 2.694 2.56 5.573-5.387"
    />
    <Path
      fill="#B4BCFF"
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M68.626 36.453v15.093c0 .134 0 .24-.026.374a10.456 10.456 0 0 0-6.934-2.587c-2.506 0-4.826.88-6.666 2.347-2.454 1.946-4 4.96-4 8.32 0 2 .56 3.893 1.546 5.493.24.427.534.827.854 1.2l-4.88 2.693c-3.04 1.707-8 1.707-11.04 0l-14.24-7.893c-3.227-1.787-5.867-6.267-5.867-9.947V36.453c0-3.68 2.64-8.16 5.867-9.947l14.24-7.893c3.04-1.707 8-1.707 11.04 0l14.24 7.893c3.226 1.787 5.866 6.267 5.866 9.947Z"
    />
    <Path fill="#B4BCFF" d="M19.453 31.84 43 45.467 66.386 31.92" />
    <Path
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M19.453 31.84 43 45.467 66.386 31.92M43 69.626V45.44"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={46.5}
        x2={46.5}
        y1={0}
        y2={95}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#EBEDFF" />
        <Stop offset={1} stopColor="#fff" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default PackageReady
