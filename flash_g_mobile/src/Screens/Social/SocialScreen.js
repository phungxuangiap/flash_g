import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {DeskComponentType2} from '../../appComponents/appComponents';
import {useSelector} from 'react-redux';
import {accessTokenSelector, onlineStateSelector} from '../../redux/selectors';
import {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {fetchAllGlobalDesks} from '../../service/fetchRemoteData';
import {useFocusEffect} from '@react-navigation/native';

export function SocialScreen() {
  const onlineState = useSelector(onlineStateSelector);
  const accessToken = useSelector(accessTokenSelector);
  const [globalDesks, setGlobalDesks] = useState('');
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
                id={desk._id}
                title={desk.title}
                primaryColor={desk.primaryColor}
                description={desk.description}
                news={desk.new_card}
                progress={desk.inprogress_card}
                preview={desk.preview_card}
                onDelete={() => {}}
                onClick={() => {}}
                onEdit={() => {}}
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
