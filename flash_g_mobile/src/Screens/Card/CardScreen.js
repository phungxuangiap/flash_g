import {Text} from '@react-navigation/elements';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ComponentStyle} from '../../appComponents/style';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  gameSelector,
  loadingSelector,
} from '../../redux/selectors';
import {
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
import {REACT_APP_URL} from '@env';

export default function CardScreen() {
  const desk = useSelector(gameSelector);
  const [showPopUp, setShowPopUp] = useState(false);
  const [vocab, setVocab] = useState('');
  const loading = useSelector(loadingSelector);
  const [description, setDescription] = useState('');
  const [sentence, setSentence] = useState('');
  const dispatch = useDispatch();
  const accessToken = useSelector(accessTokenSelector);
  const navigation = useNavigation();
  const [data, setData] = useState(null);

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
    fetchData(accessToken);
  }, [accessToken]);
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
              await createCard(
                accessToken,
                desk,
                vocab,
                sentence,
                description,
                data,
                setData,
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
