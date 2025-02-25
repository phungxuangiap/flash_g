import * as React from 'react';
import Svg, {Path, Circle, Rect} from 'react-native-svg';

function Logo(props) {
  return (
    <Svg
      opacity={props.scale}
      viewBox="0 0 204.101 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M0 125C0 55.96 55.96 0 125 0c34.51 0 63.07 42.04 55 73-6 23-6 23 21 52-11.5 42.5 16.62 74.37-6 97-22.63 22.62-35.49 28-70 28C55.96 250 0 194.03 0 125z"
        fill="#273D4B"
        fillOpacity={1}
        fillRule="evenodd"
      />
      <Circle cx={125} cy={125} r={75} fill="#FFF" fillOpacity={1} />
      <Rect
        x={99}
        y={100}
        rx={10}
        width={52}
        height={49}
        fill="#6CDDAB"
        fillOpacity={1}
      />
      <Rect
        x={98.5}
        y={99.5}
        rx={10}
        width={53}
        height={50}
        stroke="#000"
        strokeOpacity={0.2}
        strokeWidth={1}
      />
    </Svg>
  );
}

export default Logo;
