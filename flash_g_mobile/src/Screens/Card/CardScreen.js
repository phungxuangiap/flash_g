import {Text} from '@react-navigation/elements';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {ComponentStyle} from '../../appComponents/style';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  currentCardsSelector,
  currentDesks,
  gameSelector,
  loadingSelector,
  modeStateSelector,
  userSelector,
} from '../../redux/selectors';
import {
  CardComponent,
  CreateNewCardPopUp,
  CreateNewDeskPopUp,
  LoadingOverlay,
  OverLay,
  RadiusRetangleButton,
  TitleAndNumber,
  UpdateCardPopUp,
} from '../../appComponents/appComponents';
import createCard from '../../service/createCard';
import {setLoading} from '../../redux/slices/stateSlice';
import axios from 'axios';
import {refresh} from '../../service/refreshAccessToken';
import {useNavigation} from '@react-navigation/native';
import uuid from 'react-native-uuid';

import {
  updateCurrentCards,
  updateCurrentDesks,
} from '../../redux/slices/gameSlice';
import {
  getAllCurrentCardsOfDesk,
  getImageOfDesk,
  updateCard,
} from '../../LocalDatabase/database';
import {Card} from '../../LocalDatabase/model';
import {
  ActiveStatus,
  DeletedStatus,
  Game,
  LightMode,
  MainGame,
} from '../../constants';
import {updateCardToRemote} from '../../service/postToRemote';
import {REACT_APP_URL} from '../../../env';
import {
  back_dark,
  back_desk_dark,
  back_primary,
  icon_secondary,
  text_primary,
  text_primary_dark,
  text_secondary,
} from '../../assets/colors/colors';
import {fetchImageOfDesk} from '../../service/imageService';

export default function CardScreen() {
  const mode = useSelector(modeStateSelector);
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
  const [avata, setAvata] = useState(undefined);

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
        if (item.active_status !== DeletedStatus) {
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
  console.log('AVATA', avata, avata ? 'avata' : 'null');
  useEffect(() => {
    dispatch(setLoading(true));
    fetchImageOfDesk(accessToken, desk.original_id).then(res => {
      console.log(res);
      setAvata(res ? res.img_url : undefined);
    });

    getAllCurrentCardsOfDesk(desk._id)
      .then(listCards => {
        dispatch(
          updateCurrentCards(
            listCards.filter(item => {
              return item.active_status !== DeletedStatus;
            }),
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
    <View
      style={{
        flex: 1,
        backgroundColor: mode === LightMode ? back_primary : back_dark,
      }}>
      <View
        style={{
          ...style.headerContainer,
          backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            ...ComponentStyle.largeWhiteTitle,
            color: mode === LightMode ? text_primary : text_primary_dark,
          }}>
          {desk.title}
        </Text>
        <RadiusRetangleButton
          content={'+'}
          onClick={() => {
            setShowPopUp(true);
          }}
        />
      </View>
      <ScrollView style={{padding: 24}}>
        <View
          style={{
            flex: 1,
            aspectRatio: 1,
            backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
            borderRadius: 20,
            padding: 24,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {avata ? (
            <Image
              source={{uri: avata}}
              style={{
                position: 'absolute',
                resizeMode: 'cover',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                aspectRatio: 1,
                borderRadius: 12,
                alignSelf: 'center',
              }}
              blurRadius={8}
            />
          ) : (
            <View
              style={{
                position: 'absolute',
                resizeMode: 'contain',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                aspectRatio: 1,
                borderRadius: 12,
                alignSelf: 'center',
              }}></View>
          )}
          <View
            style={{
              position: 'relative',
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              minWidth: 200,
            }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'black',
                opacity: 0.4,
                borderRadius: 20,
              }}></View>
            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
              {desk.description}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 24}}>
              <TitleAndNumber
                title={'New'}
                number={newCards}
                color={'#C12450'}
              />
              <TitleAndNumber
                title={'In Progress'}
                number={inprogressCards}
                color={'#273D4B'}
              />
              <TitleAndNumber
                title={'Preview'}
                number={previewCards}
                color={'#6CDDAB'}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Game);
              }}
              style={{
                backgroundColor:
                  mode === LightMode ? text_primary : text_primary_dark,
                padding: 12,
                borderRadius: 20,
                marginTop: 24,
                alignSelf: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 18}}>Review</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            padding: 20,
            backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
            marginTop: 24,
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 12,
              fontWeight: '900',
              color: mode === LightMode ? 'black' : icon_secondary,
            }}>
            Active Cards
          </Text>
          {listActiveCard.length !== 0 ? (
            <ScrollView
              style={{
                backgroundColor: 'white',
                maxHeight: 280,
                borderWidth: 1,
                borderColor: 'black',
              }}>
              {listActiveCard.map((card, index) => {
                return (
                  <CardComponent
                    key={uuid.v4()}
                    card={card}
                    dispatch={dispatch}
                    listAllCurrentCard={listAllCurrentCardsOfDesk}
                    setShowUpdatePopUp={() => {
                      setIndexUpdatedCard(index);
                    }}
                    showUpdatePopUp={indexUpdatedCard}
                    isSpecialColor={index % 2 == 0}
                    setVocab={setVocab}
                    setDescription={setDescription}
                    setSentence={setSentence}
                  />
                );
              })}
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/nodata_noback.png')}
                style={{
                  width: 200,
                  height: 100,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: icon_secondary,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                No data available!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
              const id = uuid.v4();
              const newCard = new Card(
                id,
                desk._id,
                user._id,
                user._id,
                id,
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
                ActiveStatus,
              );
              console.log('NEW CARD', newCard);
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
