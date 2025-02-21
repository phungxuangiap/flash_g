import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function PullIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={props.color}
      {...props}>
      <Path d="M480-336.92L338.46-478.46l28.31-28.77L460-414v-346h40v346l93.23-93.23 28.31 28.77L480-336.92zM264.62-200q-27.62 0-46.12-18.5Q200-237 200-264.62v-96.92h40v96.92q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69h430.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-96.92h40v96.92q0 27.62-18.5 46.12Q723-200 695.38-200H264.62z" />
    </Svg>
  );
}

export default PullIcon;
