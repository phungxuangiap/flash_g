import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ProfileIcon(props) {
  return (
    <Svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        d="M5.848 13.55a26.922 26.922 0 014.326 0 17.64 17.64 0 012.336.293c1.67.338 2.76.89 3.227 1.78.35.694.35 1.52 0 2.215-.467.89-1.514 1.477-3.244 1.78-.771.155-1.552.256-2.336.302-.727.08-1.454.08-2.189.08H6.644a6.311 6.311 0 00-.804-.053 16.005 16.005 0 01-2.336-.294c-1.67-.32-2.76-.89-3.227-1.78A2.44 2.44 0 010 16.754a2.413 2.413 0 01.268-1.13c.459-.89 1.549-1.468 3.236-1.78.774-.152 1.557-.25 2.344-.293zM8.003 0c2.9 0 5.25 2.418 5.25 5.4 0 2.983-2.35 5.4-5.25 5.4S2.75 8.384 2.75 5.4c0-2.982 2.351-5.4 5.252-5.4z"
        transform="translate(4 2)"
        fill={props.color}
        fillRule="nonzero"
        stroke="none"
        strokeWidth={1}
      />
    </Svg>
  );
}

export default ProfileIcon;
