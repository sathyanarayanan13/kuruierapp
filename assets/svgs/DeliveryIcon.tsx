import * as React from 'react';
import { Svg, Path, Rect } from 'react-native-svg';

const DeliveryIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={37}
    height={37}
    fill="none"
    {...props}
  >
    <Rect width={36} height={36} x={0.5} y={0.5} stroke="#CCCEEC" rx={7.5} />
    <Path
      stroke="#2A2F5C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12.404 15.348 6.095 3.53 6.05-3.507M18.498 25.135v-6.268"
    />
    <Path
      stroke="#2A2F5C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m17.074 11.932-3.68 2.047c-.828.46-1.518 1.622-1.518 2.576v3.899c0 .954.679 2.116 1.518 2.576l3.68 2.047c.782.437 2.07.437 2.863 0l3.68-2.047c.828-.46 1.518-1.622 1.518-2.576v-3.91c0-.955-.678-2.116-1.518-2.576l-3.68-2.047c-.793-.437-2.081-.437-2.863.011ZM30 21.95C30 26.4 26.4 30 21.95 30l1.208-2.012M7 15.05C7 10.6 10.6 7 15.05 7l-1.208 2.012"
    />
  </Svg>
);
export default DeliveryIcon;
