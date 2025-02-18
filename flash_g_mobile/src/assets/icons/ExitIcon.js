import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function ExitIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2.33333 2.33333"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      {...props}>
      <G id="Layer_x0020_1">
        <Path
          d="M1.782 2.02a.236.236 0 01-.168-.07l-.447-.447-.447.447a.236.236 0 01-.169.07.238.238 0 01-.168-.406l.447-.447L.383.72A.237.237 0 01.313.55.237.237 0 01.551.313c.064 0 .124.025.169.07l.447.447.447-.447a.236.236 0 01.168-.07.238.238 0 01.168.406l-.447.448.447.447a.238.238 0 01-.168.406z"
          fill="white"
        />
      </G>
    </Svg>
  );
}

export default ExitIcon;
