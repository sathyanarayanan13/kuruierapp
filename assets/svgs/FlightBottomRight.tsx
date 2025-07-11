import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const FlightBottomRight = (props: any) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <Path
      fill="#EFF0FF"
      stroke="#2A2F5C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m10.154 15.522 3.665-.316c.556-.043 1.051-.539 1.094-1.094l.316-3.666a1.218 1.218 0 0 1 1.692-.7l1.512.76c.368.18.675.675.675 1.085l.009 3.888c-.009.282.153.666.35.863l2.435 2.435c.359.359.795.265.991-.205l2.384-6.007c.376-.94 1.265-1.127 1.982-.41l1.103 1.103c.572.572.803 1.657.495 2.409l-2.717 6.835a.67.67 0 0 0 .137.65l2.563 2.563c.803.803 1.162 2.341.812 3.426a1.28 1.28 0 0 1-.812.812c-1.085.35-2.632-.017-3.435-.82l-2.563-2.564a.67.67 0 0 0-.65-.136l-6.826 2.708c-.743.316-1.829.086-2.401-.487l-1.102-1.102c-.718-.718-.53-1.606.41-1.982l6.006-2.384c.47-.18.564-.632.206-.991l-2.436-2.435c-.196-.197-.58-.36-.854-.36l-3.888-.008c-.41 0-.897-.299-1.085-.675l-.76-1.512a1.188 1.188 0 0 1 .692-1.683Z"
    />
  </Svg>
);
export default FlightBottomRight;
