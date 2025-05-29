import * as React from 'react';
import { Svg, Path, Rect } from 'react-native-svg';

const AddIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={35}
    fill="none"
    viewBox="0 0 38 38"
    {...props}
  >
    <Rect width={36} height={36} x={0.5} y={0.5} stroke="#666EFF" rx={7.5} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M25 19H13M19 25V13"
    />
  </Svg>
);
export default AddIcon;
