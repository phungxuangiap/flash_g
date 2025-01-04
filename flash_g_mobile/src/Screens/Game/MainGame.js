import {View} from 'react-native';
import {FlashCard} from './GameService';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {currentCardsSelector} from '../../redux/selectors';
import {ActiveStatus, Card} from '../../constants';
import {useNavigation} from '@react-navigation/native';

export default function GameComponent() {
  const listActiveCard = useSelector(currentCardsSelector).filter(item => {
    return item.active_status === ActiveStatus;
  });
  const [randomCard, setRandomCard] = useState(
    Math.round((listActiveCard.length - 1) * Math.random()),
  );
  const navigation = useNavigation();
  useEffect(() => {
    if (listActiveCard.length === 0) {
      navigation.navigate(Card);
    }
  }, [listActiveCard]);
  const currentCard = listActiveCard[randomCard];

  return <FlashCard card={currentCard} setRandomCard={setRandomCard} />;
}
