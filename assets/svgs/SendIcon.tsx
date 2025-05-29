import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const SendIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <Path
      fill="#E0FFF4"
      stroke="#009C66"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.42.88 2.995 4.113C.522 4.88.486 8.368 2.943 9.187l2.864.954c.795.266 1.42.89 1.685 1.685l.954 2.864c.82 2.457 4.301 2.416 5.073-.053l3.235-10.423c.636-2.05-1.285-3.97-3.335-3.335Z"
    />
  </Svg>
);
export default SendIcon;
