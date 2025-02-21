import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function LightIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill={props.color}
      {...props}>
      <Path d="M480-120q-66 0-113-47t-47-113H200q-33 0-56.5-23.5T120-360q0-140 92-241.5T440-718v-122h80v122q136 15 228 116.5T840-360q0 33-23.5 56.5T760-280H640q0 66-47 113t-113 47zM200-360h560q0-116-82-198t-198-82q-116 0-198 82t-82 198zm280 160q33 0 56.5-23.5T560-280H400q0 33 23.5 56.5T480-200zm0-80z" />
    </Svg>
  );
}

export default LightIcon;
