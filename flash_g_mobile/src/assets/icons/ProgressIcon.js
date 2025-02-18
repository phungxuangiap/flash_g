import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ProgressIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.5 12a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0zM12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm4.5-8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3-1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-6 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        fill={props.color}
      />
    </Svg>
  );
}

export default ProgressIcon;
