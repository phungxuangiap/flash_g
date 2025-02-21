import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CommentIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={props.color}
      {...props}>
      <Path d="M260-420h280v-40H260v40zm0-120h440v-40H260v40zm0-120h440v-40H260v40zM120-156.92v-618.46q0-27.62 18.5-46.12Q157-840 184.62-840h590.76q27.62 0 46.12 18.5Q840-803 840-775.38v430.76q0 27.62-18.5 46.12Q803-280 775.38-280h-532.3L120-156.92zM226-320h549.38q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-430.76q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69H184.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v521.15L226-320zm-66 0v-480 480z" />
    </Svg>
  );
}

export default CommentIcon;
