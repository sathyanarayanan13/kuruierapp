import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const Delivered = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={25}
    fill="none"
    viewBox="0 0 25 30"
    {...props}
  >
    <Path
      fill="#EFF0FF"
      stroke="#2A2F5C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.054 1.509c.793-.679 2.093-.679 2.897 0l1.817 1.563c.345.3.989.54 1.449.54h1.954c1.219 0 2.22 1.001 2.22 2.22v1.954c0 .449.24 1.104.54 1.449l1.563 1.816c.678.794.678 2.093 0 2.898l-1.564 1.816c-.298.345-.54.989-.54 1.449v1.954c0 1.219-1 2.22-2.219 2.22h-1.954c-.449 0-1.104.24-1.449.54l-1.817 1.563c-.793.679-2.092.679-2.897 0l-1.816-1.563c-.345-.3-.99-.54-1.449-.54H5.8c-1.219 0-2.219-1.001-2.219-2.22v-1.966c0-.448-.241-1.092-.529-1.437L1.5 13.937c-.667-.793-.667-2.08 0-2.874l1.552-1.828c.288-.345.53-.989.53-1.437V5.82c0-1.219 1-2.219 2.218-2.219h1.989c.448 0 1.104-.241 1.449-.54l1.816-1.552Z"
    />
    <Path
      stroke="#2A2F5C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m8.33 12.49 2.77 2.782 5.553-5.565"
    />
  </Svg>
);
export default Delivered;
