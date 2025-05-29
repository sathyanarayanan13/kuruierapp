import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const BoxIcon = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.434 8.06 13 13.596l9.5-5.504M13 23.41v-9.825"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.757 2.687 4.972 5.893C3.662 6.62 2.59 8.44 2.59 9.934v6.121c0 1.495 1.073 3.315 2.383 4.04l5.785 3.218c1.235.683 3.261.683 4.496 0l5.785-3.217c1.311-.726 2.384-2.546 2.384-4.041v-6.12c0-1.496-1.073-3.316-2.384-4.042l-5.785-3.217c-1.246-.683-3.26-.683-4.496.01Z"
    />
  </Svg>
);
export default BoxIcon;
