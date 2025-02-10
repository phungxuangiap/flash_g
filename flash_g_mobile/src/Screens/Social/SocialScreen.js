import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {DeskComponentType2} from '../../appComponents/appComponents';
import {useDispatch, useSelector} from 'react-redux';
import {accessTokenSelector, onlineStateSelector} from '../../redux/selectors';
import {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {fetchAllGlobalDesks} from '../../service/fetchRemoteData';
import {useFocusEffect} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import React from 'react';
import {fetchImageOfDesk} from '../../service/imageService';
import {refresh} from '../../service/refreshAccessToken';

export function SocialScreen() {
  const dispatch = useDispatch();
  const onlineState = useSelector(onlineStateSelector);
  const accessToken = useSelector(accessTokenSelector);
  const [globalDesks, setGlobalDesks] = useState([]);
  const [deskImageRelationship, setDeskImageRelationship] = useState({});
  async function handleData(accessToken) {
    const data = await fetchAllGlobalDesks(accessToken).catch(err => {
      refresh(dispatch);
    });
    setGlobalDesks(data);
    if (data) {
      await Promise.all(
        data.map(desk => {
          return fetchImageOfDesk(accessToken, desk._id).then(img_url => {
            setDeskImageRelationship(pre => {
              let obj = pre;
              obj[desk._id] = img_url;
              return obj;
            });
          });
        }),
      );
    }
  }
  useFocusEffect(
    useCallback(() => {
      handleData(accessToken);
    }, [onlineState, accessToken]),
  );
  console.log('LIST MAP', deskImageRelationship);
  return onlineState ? (
    <View style={{padding: 24}}>
      <Text style={{fontSize: 36, color: 'black', fontWeight: 'bold'}}>
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
                img_url={deskImageRelationship}
                primaryColor={desk.primary_color}
                description={desk.description}
                numCard={
                  desk.new_card + desk.inprogress_card + desk.preview_card
                }
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
