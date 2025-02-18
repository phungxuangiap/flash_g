import * as React from 'react';
import Svg, {G, Path, Rect} from 'react-native-svg';

function PlusIcon(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" {...props}>
      <G id="Layer_2" data-name="Layer 2">
        <G id="Plus">
          <Path
            d="M22.5 2.5v20h-20A2.5 2.5 0 000 25a2.5 2.5 0 002.5 2.5h20v20A2.5 2.5 0 0025 50a2.5 2.5 0 002.5-2.5v-45A2.5 2.5 0 0025 0a2.5 2.5 0 00-2.5 2.5z"
            fill="white"
          />
          <Rect
            x={31}
            y={22.5}
            width={19}
            height={5}
            rx={2.5}
            ry={2.5}
            fill="white"
          />
        </G>
      </G>
    </Svg>
  );
}

export default PlusIcon;
