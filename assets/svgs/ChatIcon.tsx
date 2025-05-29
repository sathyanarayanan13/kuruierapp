import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const ChatIcon = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    viewBox="0 0 22 25"
    {...props}
  >
    <Path
      stroke="#4B507E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M6 17.43h4l4.45 2.96a.997.997 0 0 0 1.55-.83v-2.13c3 0 5-2 5-5v-6c0-3-2-5-5-5H6c-3 0-5 2-5 5v6c0 3 2 5 5 5Z"
    />
  </Svg>
);
export default ChatIcon;
