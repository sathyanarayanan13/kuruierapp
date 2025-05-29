import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const FileDownload = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={19}
    fill="none"
    viewBox='0 0 22 22'
    {...props}
  >
    <Path
      stroke="#5059A5"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m6.32 4.472 2.56-2.49 2.56 2.49"
    />
    <Path
      fill="#5059A5"
      d="M8.13 11.942a.75.75 0 0 0 1.5 0h-1.5Zm1.5 0V2.051h-1.5v9.891h1.5Z"
    />
    <Path
      stroke="#5059A5"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M1 9.822c0 4.3 3 7.781 8 7.781s8-3.482 8-7.78"
    />
  </Svg>
);
export default FileDownload;
