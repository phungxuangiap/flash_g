import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from '@react-navigation/elements';
import {ComponentStyle} from '../../appComponents/style';
import {useDispatch, useSelector} from 'react-redux';
import {currentCardsSelector, gameSelector} from '../../redux/selectors';
import {updateCard} from '../../LocalDatabase/database';
import {Card} from '../../LocalDatabase/model';
import {ActiveStatus} from '../../constants';
import {updateCurrentCards} from '../../redux/slices/gameSlice';

function Game() {
  this.flashCard = FlashCard;
  this.updateCardLevel = async function (card, point) {
    let level = card.level;
    switch (point) {
      case 1:
        level = 0;
        break;
      case 3:
        level = level + 1;
        break;
      case 4:
        level = level + 2;
        break;
      default:
        break;
    }
    await updateCard(
      new Card(
        card._id,
        card.desk_id,
        card.user_id,
        card.author_id,
        card.original_id,
        card.status,
        level,
        JSON.stringify(new Date()).slice(1, -1),
        card.vocab,
        card.description,
        card.sentence,
        card.vocab_audio,
        card.sentence_audio,
        card.type,
        JSON.stringify(new Date()).slice(1, -1),
        ActiveStatus,
      ),
    )
      .then(res => {
        console.log('Done');
      })
      .catch(err => {
        console.log('Play game error with message:', err);
      });
  };
}
export const GameInstance = new Game();

export const FlashCard = function ({card, setRandomCard}) {
  const [textShowFlash, setTextShowFlash] = useState('');
  const dispatch = useDispatch();
  const listCurrentCard = useSelector(currentCardsSelector);
  const currentDesk = useSelector(gameSelector);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  useEffect(() => {
    if (card) {
      setTextShowFlash(card.vocab);
    }
  }, [listCurrentCard]);
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <View style={FlashCardStyle.container}>
      <View style={FlashCardStyle.flash_card}>
        <Text style={ComponentStyle.textWhite16Medium}>{textShowFlash}</Text>
      </View>
      <View style={FlashCardStyle.submit_button}>
        {showAnswer ? (
          <>
            <TouchableOpacity
              style={ComponentStyle.button}
              onPress={() => {
                GameInstance.updateCardLevel(card, 1);
                let list = listCurrentCard.filter(item => {
                  return item._id !== card._id;
                });
                list.push(card);
                dispatch(updateCurrentCards(list));
                if (list.length) {
                  setShowAnswer(false);
                  setRandomCard(Math.round((list.length - 1) * Math.random()));
                }
              }}>
              <Text style={ComponentStyle.textWhite16Medium}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ComponentStyle.button}
              onPress={() => {
                GameInstance.updateCardLevel(card, 2);
                let list = listCurrentCard.filter(item => {
                  return item._id !== card._id;
                });
                if (card.level === 0) {
                  list.push(card);
                }
                dispatch(updateCurrentCards(list));
                if (list.length) {
                  setRandomCard(Math.round((list.length - 1) * Math.random()));
                  setShowAnswer(false);
                }
              }}>
              <Text style={ComponentStyle.textWhite16Medium}>Hard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ComponentStyle.button}
              onPress={() => {
                GameInstance.updateCardLevel(card, 3);
                let list = listCurrentCard.filter(item => {
                  return item._id !== card._id;
                });
                dispatch(updateCurrentCards(list));
                if (list.length) {
                  setRandomCard(Math.round((list.length - 1) * Math.random()));
                  setShowAnswer(false);
                }
              }}>
              <Text style={ComponentStyle.textWhite16Medium}>Okay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ComponentStyle.button}
              onPress={() => {
                GameInstance.updateCardLevel(card, 4);
                let list = listCurrentCard.filter(item => {
                  return item._id !== card._id;
                });
                dispatch(updateCurrentCards(list));
                if (list.length) {
                  setRandomCard(Math.round((list.length - 1) * Math.random()));
                  setShowAnswer(false);
                }
              }}>
              <Text style={ComponentStyle.textWhite16Medium}>Nice</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={ComponentStyle.button}
              onPress={() => {
                setShowAnswer(preState => !preState);
                setTextShowFlash(card.description);
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
