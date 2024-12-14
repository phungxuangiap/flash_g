import {Text} from '@react-navigation/elements';
import {StyleSheet, View} from 'react-native';
import {ComponentStyle} from '../../appComponents/style';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  deskSelector,
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

export default function CardScreen() {
  const desk = useSelector(deskSelector);
  const [showPopUp, setShowPopUp] = useState(false);
  const [vocab, setVocab] = useState('');
  const loading = useSelector(loadingSelector);
  const [description, setDescription] = useState('');
  const [sentence, setSentence] = useState('');
  const dispatch = useDispatch();
  const accessToken = useSelector(accessTokenSelector);
  const [data, setData] = useState(null);
  function fetchData(accessToken) {
    dispatch(setLoading(true));
    axios
      .get(`http://192.168.102.15:5001/api/card/${desk._id}`, {
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
