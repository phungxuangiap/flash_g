import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {icon_secondary, text_primary} from '../colors/colors';

function EditIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-edit"
      color={icon_secondary}
      {...props}>
      <Path d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34" />
      <Path d="M18 2L22 6 12 16 8 16 8 12 18 2z" />
    </Svg>
  );
}

export default EditIcon;
