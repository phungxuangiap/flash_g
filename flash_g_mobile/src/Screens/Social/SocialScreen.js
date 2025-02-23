import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {DeskComponentType2} from '../../appComponents/appComponents';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  modeStateSelector,
  onlineStateSelector,
} from '../../redux/selectors';
import {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  fetchAllCurrentCardOfDesk,
  fetchAllGlobalDesks,
} from '../../service/fetchRemoteData';
import {useFocusEffect} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import React from 'react';
import {fetchImageOfDesk} from '../../service/imageService';
import {refresh} from '../../service/refreshAccessToken';
import {store} from '../../redux/store';
import {LightMode} from '../../constants';
import {
  back_dark,
  back_primary,
  text_primary,
  text_primary_dark,
} from '../../assets/colors/colors';

export function SocialScreen() {
  const dispatch = useDispatch();
  const onlineState = useSelector(onlineStateSelector);
  const mode = useSelector(modeStateSelector);
  const accessToken = useSelector(accessTokenSelector);
  const [globalDesks, setGlobalDesks] = useState([]);
  const [deskImageRelationship, setDeskImageRelationship] = useState({});
  const [deskNumCardRelationship, setDeskNumCardRelationship] = useState({});
  async function handleData(accessToken) {
    const data = await fetchAllGlobalDesks(accessToken).catch(error => {
      if (error.status === 401) {
        refresh(dispatch).then(actk => {
          fetchAllGlobalDesks(actk, dispatch);
        });
      }
    });
    setGlobalDesks(data);
    if (data) {
      await Promise.all(
        data.map(desk => {
          return fetchImageOfDesk(accessToken, desk._id)
            .then(img_url => {
              console.log('IMG URL', img_url);
              setDeskImageRelationship(pre => {
                let obj = {...pre};
                obj[desk._id] = img_url;
                return obj;
              });
            })
            .then(res => {
              fetchAllCurrentCardOfDesk(desk._id).then(response => {
                setDeskNumCardRelationship(pre => {
                  let obj = {...pre};
                  obj[desk._id] = response.length;
                  return obj;
                });
              });
            });
        }),
      );
    }
  }
  console.log(deskImageRelationship);
  useFocusEffect(
    useCallback(() => {
      handleData(accessToken);
    }, [onlineState, accessToken]),
  );
  return onlineState ? (
    <View
      style={{
        padding: 24,
        flex: 1,
        backgroundColor: mode === LightMode ? back_primary : back_dark,
      }}>
      <Text
        style={{
          fontSize: 36,
          color: mode === LightMode ? text_primary : text_primary_dark,
          fontWeight: 'bold',
        }}>
        Society
      </Text>
      <ScrollView scrollEnabled={true}>
        {globalDesks &&
          globalDesks.map((desk, index) => {
            return (
              <DeskComponentType2
                key={uuid.v4()}
                id={desk._id}
                title={desk.title}
                img_url={deskImageRelationship[desk.original_id]?.img_url}
                primaryColor={desk.primary_color}
                description={desk.description}
                numCard={deskNumCardRelationship[desk._id] || 0}
                authorId={desk.author_id}
                onDelete={() => {}}
                onClick={() => {}}
                onEdit={() => {}}
                onPull={() => {
                  setGlobalDesks(pre => {
                    let obj = pre;
                    obj = pre.filter(item => {
                      return item._id !== desk._id;
                    });
                    console.log('OBJECT', obj);
                    return obj;
                  });
                }}
                accessToken={accessToken}
                isLightMode={mode === LightMode}
              />
            );
          })}
      </ScrollView>
    </View>
  ) : (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'black'}}>You're offline</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
