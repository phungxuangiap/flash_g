import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {DeskComponentType2} from '../../appComponents/appComponents';
import {useSelector} from 'react-redux';
import {accessTokenSelector, onlineStateSelector} from '../../redux/selectors';
import {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {fetchAllGlobalDesks} from '../../service/fetchRemoteData';
import {useFocusEffect} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import React from 'react';

export function SocialScreen() {
  const onlineState = useSelector(onlineStateSelector);
  const accessToken = useSelector(accessTokenSelector);
  const [globalDesks, setGlobalDesks] = useState([]);
  async function handleData(accessToken) {
    const data = await fetchAllGlobalDesks(accessToken);
    setGlobalDesks(data);
  }
  useFocusEffect(
    useCallback(() => {
      handleData(accessToken);
    }, [onlineState]),
  );
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
                    return pre.filter(item => {
                      item._id !== desk._id;
                    });
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
