import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {accessTokenSelector} from '../../redux/selectors';
export default function DeskBoardScreen() {
  const dispatch = useDispatch();
  const accessToken = useSelector(accessTokenSelector);

  return <></>;
}
