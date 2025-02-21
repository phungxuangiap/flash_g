import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function SearchIcon(props) {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_19_3)">
        <Path
          d="M23.649 21.945l-5.082-5.08a1.333 1.333 0 00-1.882 0A8.418 8.418 0 012.775 8.39a8.415 8.415 0 0113.451-4.038 8.415 8.415 0 012.74 8.64 1.205 1.205 0 002.33.62A10.844 10.844 0 0015.228.918 10.85 10.85 0 001.731 4.893a10.843 10.843 0 008.734 16.77 10.85 10.85 0 007.115-2.364l4.365 4.36a1.202 1.202 0 001.704 0 1.203 1.203 0 000-1.713z"
          fill={props.borderColor}
        />
        <Path
          d="M14.438 14.435a1.184 1.184 0 00-1.444-.13 4.101 4.101 0 01-4.168.082 1.16 1.16 0 00-1.381.158l-.072.068a1.16 1.16 0 00.202 1.833 6.523 6.523 0 006.737-.135 1.16 1.16 0 00.198-1.8l-.072-.076z"
          fill={props.color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_19_3">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SearchIcon;
