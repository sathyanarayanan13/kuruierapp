import * as React from 'react';
import { Svg, Path, Rect } from 'react-native-svg';

const FilterIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={35}
    fill="none"
    viewBox="0 0 38 38"
    {...props}
  >
    <Rect width={36} height={36} x={0.5} y={0.5} stroke="#866FFF" rx={7.5} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.5 12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v.172a2 2 0 0 1-.586 1.414l-3.828 3.828a2 2 0 0 0-.586 1.414v4.73a2 2 0 0 1-1.367 1.898l-2 .666a2 2 0 0 1-2.633-1.897v-4.952a2 2 0 0 0-.52-1.345l-3.96-4.356a2 2 0 0 1-.52-1.345V12Z"
    />
  </Svg>
);
export default FilterIcon;
