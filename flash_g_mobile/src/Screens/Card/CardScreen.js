import {Text} from '@react-navigation/elements';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ComponentStyle} from '../../appComponents/style';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  currentCardsSelector,
  currentDesks,
  gameSelector,
  loadingSelector,
  userSelector,
} from '../../redux/selectors';
import {
  CardComponent,
  CreateNewCardPopUp,
  CreateNewDeskPopUp,
  LoadingOverlay,
  OverLay,
  RadiusRetangleButton,
  UpdateCardPopUp,
} from '../../appComponents/appComponents';
import createCard from '../../service/createCard';
import {setLoading} from '../../redux/slices/stateSlice';
import axios from 'axios';
import {refresh} from '../../service/refreshAccessToken';
import {useNavigation} from '@react-navigation/native';
import uuid from 'react-native-uuid';

import {REACT_APP_URL} from '@env';
import {
  updateCurrentCards,
  updateCurrentDesks,
} from '../../redux/slices/gameSlice';
import {
  getListCurrentCardsOfDesk,
  updateCard,
} from '../../LocalDatabase/database';
import {Card} from '../../LocalDatabase/model';
import {ActiveStatus, Game, MainGame} from '../../constants';

export default function CardScreen() {
  const desk = useSelector(gameSelector);
  const [showPopUp, setShowPopUp] = useState(false);
  const [indexUpdatedCard, setIndexUpdatedCard] = useState(undefined);
  const [vocab, setVocab] = useState('');
  const loading = useSelector(loadingSelector);
  const [description, setDescription] = useState('');
  const [sentence, setSentence] = useState('');
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const listCurrentDesks = useSelector(currentDesks);
  const accessToken = useSelector(accessTokenSelector);
  const navigation = useNavigation();
  const listAllCurrentCardsOfDesk = useSelector(currentCardsSelector);
  const [listActiveCard, updateListActiveCard] = useState([]);

  const [newCards, updateNewCard] = useState(0);
  const [inprogressCards, updateInprogressCard] = useState(0);
  const [previewCards, updatePreviewCard] = useState(0);

  // const []
  function updateDesk(list) {
    let news = 0;
    let in_progress = 0;
    let preview = 0;
    let activeCards = [];
    list &&
      list.forEach(item => {
        if (item.active_status === ActiveStatus) {
          activeCards.push(item);
          if (item.status === 'new') {
            news = news + 1;
          } else if (item.status === 'in_progress') {
            in_progress = in_progress + 1;
          } else {
            preview = preview + 1;
          }
        }
      });
    updateListActiveCard(activeCards);
    updateNewCard(news);
    updateInprogressCard(in_progress);
    updatePreviewCard(preview);
  }
  function fetchData(accessToken) {
    dispatch(setLoading(true));
    axios
      .get(`http://${REACT_APP_URL}/api/card/${desk._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        console.log('Get data successfully');
        setData(res.data);
      })
      .catch(async err => {
        console.log('Get data error with message ', err);
        await refresh();
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }
  useEffect(() => {
    updateDesk(listAllCurrentCardsOfDesk);
  }, [listAllCurrentCardsOfDesk]);

  useEffect(() => {
    dispatch(setLoading(true));
    getListCurrentCardsOfDesk(desk._id)
      .then(listCards => {
        console.log('[LIST CARD]', listCards);
        dispatch(
          updateCurrentCards(
            listCards,
            // listCards.filter(item => {
            //   return item.active_status === ActiveStatus;
            // }),
          ),
        );
        dispatch(setLoading(false));
        return 0;
      })
      .catch(err => {
        console.log('Get current cards error with message:', err);
      });
  }, []);
  return loading ? (
    <LoadingOverlay />
  ) : (
    <View style={{flex: 1}}>
      <View
        style={{
          ...style.headerContainer,
          backgroundColor: desk.primary_color,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={ComponentStyle.largeWhiteTitle}>{desk.title}</Text>
        <RadiusRetangleButton
          content={'+'}
          onClick={() => {
            setShowPopUp(true);
          }}
        />
      </View>
      <View>
        <View>
          <Text>{newCards}</Text>
          <Text>{inprogressCards}</Text>
          <Text>{previewCards}</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(Game);
          }}
          style={{
            backgroundColor: 'black',
            padding: 12,
            borderRadius: 12,
            alignSelf: 'baseline',
          }}>
          <Text style={{color: 'white'}}>Play</Text>
        </TouchableOpacity>

        <ScrollView
          style={{
            backgroundColor: 'white',
            height: 100,
            paddingLeft: 20,
            paddingRight: 20,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 20,
          }}>
          {/*TODO: fix render allcard in this list*/}
          {listActiveCard.map((card, index) => {
            return (
              <CardComponent
                key={uuid.v4()}
                card={card}
                dispatch={dispatch}
                listAllCurrentCard={listAllCurrentCardsOfDesk}
                setShowUpdatePopUp={() => {
                  setIndexUpdatedCard(index);
                  console.log(index);
                }}
                showUpdatePopUp={indexUpdatedCard}
              />
            );
          })}
        </ScrollView>
      </View>
      {showPopUp ? (
        <>
          <OverLay />
          <CreateNewCardPopUp
            vocab={vocab}
            setVocab={setVocab}
            description={description}
            setDescription={setDescription}
            sentence={sentence}
            setSentence={setSentence}
            close={() => {
              setShowPopUp(false);
            }}
            create={async () => {
              dispatch(setLoading(true));
              // await createCard(
              //   accessToken,
              //   desk,
              //   vocab,
              //   sentence,
              //   description,
              //   data,
              //   setData,
              // );
              const newCard = new Card(
                uuid.v4(),
                desk._id,
                user._id,
                'new',
                0,
                JSON.stringify(new Date()).slice(1, -1),
                vocab,
                description,
                sentence,
                '',
                '',
                'verb',
                JSON.stringify(new Date()).slice(1, -1),
              );
              await updateCard(newCard)
                .then(res => {
                  console.log('Create card');
                  console.log('[NEW CARD]', res);
                })
                .catch(err => {
                  console.log('Create new card error with message:', err);
                });
              updateNewCard(preState => preState + 1);
              dispatch(
                updateCurrentCards([
                  ...listAllCurrentCardsOfDesk,
                  JSON.parse(JSON.stringify(newCard)),
                ]),
              );
              setShowPopUp(false);
              dispatch(setLoading(false));
            }}
          />
        </>
      ) : (
        <></>
      )}
      {indexUpdatedCard || indexUpdatedCard === 0 ? (
        <>
          <OverLay />
          <UpdateCardPopUp
            vocab={vocab}
            setVocab={setVocab}
            description={description}
            setDescription={setDescription}
            sentence={sentence}
            setSentence={setSentence}
            close={() => {
              setIndexUpdatedCard(undefined);
            }}
            update={async () => {
              dispatch(setLoading(true));
              // await createCard(
              //   accessToken,
              //   desk,
              //   vocab,
              //   sentence,
              //   description,
              //   data,
              //   setData,
              // );
              const updatedCard = {
                ...listActiveCard[indexUpdatedCard],
                sentence,
                vocab,
                description,
                modified_time: JSON.stringify(new Date()).slice(1, -1),
              };
              await updateCard(updatedCard)
                .then(res => {
                  console.log('Update card');
                  console.log('[NEW CARD]', res);
                })
                .catch(err => {
                  console.log('Update new card error with message:', err);
                });
              updateNewCard(preState => preState + 1);
              dispatch(
                updateCurrentCards(
                  listAllCurrentCardsOfDesk.map(item => {
                    return item._id === updatedCard._id ? updatedCard : item;
                  }),
                ),
              );
              setIndexUpdatedCard(undefined);
              dispatch(setLoading(false));
            }}
          />
        </>
      ) : (
        <></>
      )}
      {loading ? <LoadingOverlay /> : <></>}
    </View>
  );
}

const style = StyleSheet.create({
  headerContainer: {
    padding: 12,
  },
});
