import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from '@react-navigation/elements';
import {ComponentStyle} from '../../appComponents/style';
import {useDispatch, useSelector} from 'react-redux';
import {
  currentCardsSelector,
  gameSelector,
  modeStateSelector,
} from '../../redux/selectors';
import {updateCard} from '../../LocalDatabase/database';
import {Card} from '../../LocalDatabase/model';
import {ActiveStatus, LightMode} from '../../constants';
import {updateCurrentCards} from '../../redux/slices/gameSlice';
import {
  back_dark,
  back_primary,
  text_primary,
  text_primary_dark,
} from '../../assets/colors/colors';

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
    const updatedCard = new Card(
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
      card.remote_id,
      card.remote_desk_id,
    );
    console.log('updated card', updatedCard);
    await updateCard(updatedCard)
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
  const mode = useSelector(modeStateSelector);
  useEffect(() => {
    if (card) {
      setTextShowFlash(card.vocab);
    }
  }, [listCurrentCard]);
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <Pressable
      style={{
        ...FlashCardStyle.container,
        backgroundColor: mode === LightMode ? back_primary : back_dark,
      }}
      onPress={() => {
        setShowAnswer(preState => !preState);
        setTextShowFlash(preState =>
          preState === card.description ? card.vocab : card.description,
        );
      }}>
      <View
        style={{
          ...FlashCardStyle.flash_card,
          backgroundColor:
            mode === LightMode ? text_primary : text_primary_dark,
        }}>
        <Text
          style={{
            ...ComponentStyle.textWhite16Medium,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {textShowFlash}
        </Text>
      </View>
      <View style={FlashCardStyle.submit_button}>
        {showAnswer ? (
          <View style={{flexDirection: 'row', marginBottom: 32}}>
            <TouchableOpacity
              style={{
                ...ComponentStyle.button,
                backgroundColor: '#444',
                marginRight: 12,
                paddingLeft: 24,
                paddingRight: 24,
              }}
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
              style={{
                ...ComponentStyle.button,
                backgroundColor: '#C12450',
                marginRight: 12,
                paddingLeft: 24,
                paddingRight: 24,
              }}
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
              style={{
                ...ComponentStyle.button,
                backgroundColor: '#273D4B',
                marginRight: 12,
                paddingLeft: 24,
                paddingRight: 24,
              }}
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
              style={{
                ...ComponentStyle.button,
                backgroundColor: '#6CDDAB',
                marginRight: 12,
                paddingLeft: 24,
                paddingRight: 24,
              }}
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
          </View>
        ) : (
          <></>
        )}
      </View>
    </Pressable>
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
