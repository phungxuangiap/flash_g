import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from '@react-navigation/elements';
import {ComponentStyle} from '../../appComponents/style';
import {useDispatch, useSelector} from 'react-redux';
import {currentCardsSelector, gameSelector} from '../../redux/selectors';
import getAllCurrentCards from '../../service/getAllCurrentCards';

function Game(name, implement) {
  this.name = name;
}

const GameService = [new Game('flash_card')];

export const FlashCard = function () {
  const [textShowFlash, setTextShowFlash] = useState('Vocab');
  const currentCards = useSelector(currentCardsSelector);
  const dispatch = useDispatch();
  const currentDesk = useSelector(gameSelector);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  async function renderCard() {
    if (currentDesk) {
      await getAllCurrentCards(currentDesk._id, dispatch);
    }
  }

  useEffect(() => {
    renderCard();
  }, []);

  useEffect(() => {
    if (currentCards[currentCardIndex]) {
      setTextShowFlash(currentCards[currentCardIndex].vocab);
      console.log('[CURRENT]', currentCards[currentCardIndex].vocab);
    }
  }, [currentCards]);

  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <View style={FlashCardStyle.container}>
      <View style={FlashCardStyle.flash_card}>
        <Text style={ComponentStyle.textWhite16Medium}>{textShowFlash}</Text>
      </View>
      <View style={FlashCardStyle.submit_button}>
        {showAnswer ? (
          <>
            <TouchableOpacity style={ComponentStyle.button}>
              <Text style={ComponentStyle.textWhite16Medium}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ComponentStyle.button}>
              <Text style={ComponentStyle.textWhite16Medium}>Hard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ComponentStyle.button}>
              <Text style={ComponentStyle.textWhite16Medium}>Okay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ComponentStyle.button}>
              <Text style={ComponentStyle.textWhite16Medium}>Nice</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={ComponentStyle.button}
              onPress={() => {
                setShowAnswer(preState => !preState);
                setTextShowFlash(currentCards[currentCardIndex].description);
              }}>
              <Text style={ComponentStyle.textWhite16Medium}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const FlashCardStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flash_card: {
    width: 250,
    height: 250,
    backgroundColor: 'black',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit_button: {
    position: 'absolute',
    bottom: 40,
    justifyContent: 'center',
  },
});
