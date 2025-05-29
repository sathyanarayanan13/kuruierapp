import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const MessageIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={17}
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <Path
      fill="none"
      stroke="#1C33FF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M4.978 13.73h3.183l3.54 2.356a.793.793 0 0 0 1.234-.66V13.73c2.387 0 3.978-1.59 3.978-3.978V4.978C16.913 2.591 15.322 1 12.935 1H4.978C2.591 1 1 2.591 1 4.978v4.774c0 2.387 1.591 3.978 3.978 3.978Z"
    />
  </Svg>
);
export default MessageIcon;
