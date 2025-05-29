import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const Package = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    fill="none"
    viewBox="0 0 28 28"
    {...props}
  >
    <Path
      stroke="#4B507E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M23.88 9.535v6.738c0 .06 0 .108-.011.167a4.668 4.668 0 0 0-3.095-1.155 4.766 4.766 0 0 0-2.977 1.048 4.727 4.727 0 0 0-1.785 3.714c0 .893.25 1.738.69 2.452.107.19.238.37.381.536l-2.178 1.203c-1.357.761-3.572.761-4.929 0L3.62 20.713C2.179 19.916 1 17.916 1 16.274V9.534c0-1.642 1.179-3.642 2.619-4.44l6.357-3.524c1.357-.761 3.572-.761 4.929 0l6.357 3.524c1.44.798 2.619 2.798 2.619 4.44Z"
    />
    <Path
      stroke="#4B507E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M1.93 7.478 12.44 13.56l10.441-6.048M12.441 24.347V13.55"
    />
    <Path
      fill="#fff"
      stroke="#4B507E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M27.916 20.049a5.835 5.835 0 0 1-.863 3.065 5.347 5.347 0 0 1-1.175 1.399 5.811 5.811 0 0 1-3.914 1.488 5.867 5.867 0 0 1-4.509-2.098c-.03-.045-.074-.074-.104-.12a4.201 4.201 0 0 1-.476-.669 5.835 5.835 0 0 1-.863-3.065c0-1.875.863-3.557 2.232-4.643a5.956 5.956 0 0 1 3.72-1.31c1.488 0 2.828.536 3.87 1.444.178.134.341.298.49.461a5.97 5.97 0 0 1 1.592 4.048Z"
    />
    <Path
      stroke="#4B507E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M24.18 20.019h-4.434M21.965 17.846v4.449"
    />
  </Svg>
);
export default Package;
