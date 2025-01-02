import {Text} from '@react-navigation/elements';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ComponentStyle} from '../../appComponents/style';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  currentCardsSelector,
  currentDesks,
  gameSelector,
  loadingSelector,
} from '../../redux/selectors';
import {
  CardComponent,
  CreateNewCardPopUp,
  CreateNewDeskPopUp,
  LoadingOverlay,
  OverLay,
  RadiusRetangleButton,
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

export default function CardScreen() {
  const desk = useSelector(gameSelector);
  const [showPopUp, setShowPopUp] = useState(false);
  const [vocab, setVocab] = useState('');
  const loading = useSelector(loadingSelector);
  const [description, setDescription] = useState('');
  const [sentence, setSentence] = useState('');
  const dispatch = useDispatch();
  const listCurrentDesks = useSelector(currentDesks);
  const accessToken = useSelector(accessTokenSelector);
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const listAllCardsOfDesk = useSelector(currentCardsSelector);

  const [listNewCards, updateListNewCards] = useState([]);
  const [listInprogressCards, updateListInprogressCards] = useState([]);
  const [listPreviewCards, updateListPreviewCards] = useState([]);

  // const []
  function updateDesk() {
    let news = 0;
    let in_progress = 0;
    let preview = 0;
    data &&
      data.forEach(item => {
        if (item.status === 'new') {
          news++;
        } else if (item.status === 'in_progress') {
          in_progress++;
        } else {
          preview++;
        }
      });
    console.log(news, in_progress, preview);
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
    // fetchData(accessToken);
    getListCurrentCardsOfDesk(desk._id)
      .then(listCards => {
        dispatch(updateCurrentCards(listCards));
        listCards.forEach(card => {
          if (card.status === 'new') {
            updateListNewCards(preState => [...preState, card]);
          } else if (card.status === 'inprogress') {
            updateListInprogressCards(preState => [...preState, card]);
          } else {
            updateListPreviewCards(preState => [...preState, card]);
          }
        });
        return 0;
      })
      .catch(err => {
        console.log('Get current cards error with message:', err);
      });
  }, []);
  return (
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
          <Text>{listNewCards.length}</Text>
          <Text>{listInprogressCards.length}</Text>
          <Text>{listPreviewCards.length}</Text>
        </View>
        {/* <View
          style={{flex: 1, backgroundColor: 'blue', width: 100, height: 100}}>
          <Text>Ahih</Text>
          {listAllCardsOfDesk.map(card => {
            <CardComponent vocab={card.vocab} description={card.description} />;
          })}
        </View> */}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MainGame');
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
          {listAllCardsOfDesk.map(card => {
            return (
              <CardComponent
                key={uuid.v4()}
                vocab={card.vocab}
                description={card.description}
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
                  console.log('[NEW CARD]', res);
                })
                .catch(err => {
                  console.log('Create new card error with message:', err);
                });
              updateListNewCards(preState => [...preState, newCard]);
              dispatch(
                updateCurrentCards([
                  ...listAllCardsOfDesk,
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
      {loading ? <LoadingOverlay /> : <></>}
    </View>
  );
}

const style = StyleSheet.create({
  headerContainer: {
    padding: 12,
  },
});
