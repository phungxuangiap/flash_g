import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  Touchable,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ComponentStyle} from './style';
import {deleteCard, deleteDesk, updateCard} from '../LocalDatabase/database';
import {
  updateCurrentCards,
  updateCurrentDesks,
} from '../redux/slices/gameSlice';
import {desk} from '../LocalDatabase/dbQueries';
import {DeletedStatus} from '../constants';
import {useSelector} from 'react-redux';
import {currentDesks} from '../redux/selectors';
import axios from 'axios';
import {fetchUserById} from '../service/fetchUserById';
import {cloneDesk} from '../service/cloneDesk';
export function InputTag({placeholder, value, onValueChange}) {
  return (
    <TextInput
      style={ComponentStyle.inputStyle}
      placeholder={placeholder}
      value={value}
      onChangeText={newValue => {
        onValueChange(newValue);
      }}
    />
  );
}

export function WrapContentButton({content, onClick}) {
  return (
    <TouchableOpacity
      style={ComponentStyle.button}
      onPress={() => {
        onClick();
      }}>
      <Text style={ComponentStyle.textWhite16Medium}>{content}</Text>
    </TouchableOpacity>
  );
}

export function ClickableText({content, onClick}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}>
      <Text style={ComponentStyle.textBlack16Medium}>{content}</Text>
    </TouchableOpacity>
  );
}

export function LoadingOverlay() {
  return (
    <View style={ComponentStyle.loadingOverLay}>
      <Text style={{alignSelf: 'center', color: 'white'}}>Loading...</Text>
    </View>
  );
}

export function CardComponent({
  card,
  dispatch,
  listAllCurrentCard,
  setShowUpdatePopUp,
  showUpdatePopUp,
}) {
  return (
    <View
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text style={{color: 'black'}}>{card.vocab}</Text>
      <Text style={{color: 'black'}}>{card.description}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderRadius: 20,
            borderColor: 'black',
          }}
          onPress={async () => {
            await deleteCard(card._id).then(() => {
              dispatch(
                updateCurrentCards(
                  listAllCurrentCard.filter(item => {
                    return item._id !== card._id;
                  }),
                ),
              );
            });
          }}>
          <Text style={{color: 'black'}}>x</Text>
        </TouchableOpacity>
        <View style={{padding: 5}}></View>
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderRadius: 20,
            borderColor: 'black',
          }}
          onPress={() => {
            setShowUpdatePopUp();
          }}>
          <Text style={{color: 'black'}}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function AvataBaseWordComponent({full_name}) {
  const userNameShortHand = (full_name ? full_name : 'Owner')
    .split(' ')
    .map(word => {
      return word[0];
    })
    .join('');
  return (
    <View
      style={{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 50,
        backgroundColor: '#444',
      }}>
      <Text>{userNameShortHand}</Text>
    </View>
  );
}

export function DeskComponent({
  id,
  user,
  title,
  primaryColor,
  news,
  progress,
  preview,
  onDelete,
  onClick,
  onEdit,
}) {
  const listCurrentDesks = useSelector(currentDesks);
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      style={{...ComponentStyle.deskContainer, backgroundColor: primaryColor}}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}>
        <View
          style={{
            width: 200,
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: 'white',
          }}>
          <Text style={{color: 'black'}}>Image</Text>
        </View>
        <Text style={{...ComponentStyle.largeWhiteTitle}}>{title}</Text>
        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 20,
              borderColor: 'yellow',
            }}
            onPress={async () => {
              await deleteDesk(id);
              onDelete();
              console.log('delete desk');
            }}>
            <Text style={{color: 'white'}}>x</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 20,
              borderColor: 'yellow',
            }}
            onPress={() => {
              onEdit();
            }}>
            <Text style={{color: 'white'}}>Edit</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <TextCircleBorder content={`${news} N`} color={'#C12450'} />
        <TextCircleBorder content={`${progress} I`} color={'#444444'} />
        <TextCircleBorder content={`${preview} P`} color={'#6CDDAB'} />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <AvataBaseWordComponent full_name={user ? user.full_name : 'Owner'} />
        <Text>{user ? user.full_name : 'Owner'}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          style={{backgroundColor: 'black', padding: 12}}
          onPress={async () => {
            await deleteDesk(id);
            onDelete();
            console.log('delete desk');
          }}>
          <Text>Delete</Text>
        </TouchableOpacity>
        {user ? (
          <TouchableOpacity
            style={{backgroundColor: '#444', padding: 12, marginLeft: 12}}
            onPress={() => {
              onEdit();
            }}>
            <Text>Edit</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function DeskComponentType2({
  id,
  title,
  img_url,
  primaryColor,
  description,
  numCard,
  authorId,
  onDelete,
  onClick,
  onEdit,
  onPull,
  accessToken,
}) {
  console.log('IMG', img_url);
  const [authorName, setAuthorName] = useState('');
  useEffect(() => {
    fetchUserById(authorId, accessToken).then(res => {
      if (res) {
        setAuthorName(res.data.full_name);
      }
    });
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      style={{...ComponentStyle.deskContainer, backgroundColor: primaryColor}}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          flex: 1,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: 'white',
            flex: 1,
          }}>
          {img_url[id] ? (
            <Image
              source={{
                uri: img_url[id],
              }}
              style={{resizeMode: 'cover', width: 100, height: 100}}
            />
          ) : (
            <Image
              source={require('../assets/noimage.jpg')}
              style={{resizeMode: 'cover', width: 100, height: 100}}
            />
          )}
        </View>
        <View style={{flex: 3}}>
          <Text style={{...ComponentStyle.largeWhiteTitle}}>{title}</Text>
          <Text style={{color: 'white'}}>{description}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TextCircleBorder
              content={`Total cards: ${numCard}`}
              color={'#C12450'}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{width: 50, height: 50, backgroundColor: 'white'}}></View>
            <Text>{authorName}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 50,
          alignSelf: 'flex-end',
        }}
        onPress={() => {
          onPull();
          cloneDesk(accessToken, id);
        }}>
        <Text>PULL</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export function TextCircleBorder({content, color}) {
  return (
    <View
      style={{backgroundColor: color, padding: 8, borderRadius: 50, margin: 4}}>
      <Text style={{...ComponentStyle.textWhite16Medium}}>{content}</Text>
    </View>
  );
}

export function CircleButton({content, onClick, style}) {
  return (
    <View style={{...style, alignSelf: 'center'}}>
      <TouchableOpacity
        style={{
          margin: 'auto',
          backgroundColor: '#6CDDAB',
          alignSelf: 'baseline',
          justifyContent: 'center',
          borderRadius: 50,
          width: 60,
          height: 60,
        }}
        onPress={() => {
          onClick();
        }}>
        <Text
          style={{
            alignSelf: 'baseline',
            fontSize: 42,
            margin: 'auto',
            color: 'white',
          }}>
          {content}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function OverLay() {
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.7,
      }}></View>
  );
}
export const MyCheckbox = ({checked, setChecked}) => {
  return (
    <View>
      <Pressable
        onPress={() => setChecked(!checked)}
        style={{
          width: 25,
          height: 25,
          borderWidth: 2,
          borderColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {checked && <Text style={{fontSize: 18}}>✔</Text>}
      </Pressable>
    </View>
  );
};
export function CreateNewDeskPopUp({
  input,
  setInput,
  description,
  setDescription,
  primaryColor,
  setPrimaryColor,
  accessStatus,
  setAccessStatus,
  close,
  create,
}) {
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}>
      <View style={{margin: 'auto'}}>
        <View
          style={{
            backgroundColor: '#6CDDAB',
            borderRadius: 24,
            padding: 24,
            marginBottom: 12,
          }}>
          <Text style={{...ComponentStyle.largeWhiteTitle}}>
            Create New Desk
          </Text>
          <InputTag
            placeholder={'Title'}
            content={input}
            onValueChange={value => {
              setInput(value);
            }}
          />
          <InputTag
            placeholder={'Description'}
            content={description}
            onValueChange={value => {
              setDescription(value);
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <Text>Public?</Text>
            <MyCheckbox
              checked={accessStatus === 'PUBLIC'}
              setChecked={() => {
                setAccessStatus(
                  accessStatus === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC',
                );
              }}
            />
          </View>
          <View style={{flexDirection: 'row-reverse'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#444',
                padding: 12,
                borderRadius: 24,
                margin: 4,
              }}
              onPress={() => {
                create();
              }}>
              <Text>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CircleButton
          style={{position: 'absolute', bottom: -60}}
          content={'x'}
          onClick={() => {
            close();
          }}
        />
      </View>
    </View>
  );
}
export function UpdateDeskPopUp({
  input,
  setInput,
  description,
  setDescription,
  accessStatus,
  setAccessStatus,
  close,
  update,
  desk,
}) {
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}>
      <View style={{margin: 'auto'}}>
        <View
          style={{
            backgroundColor: '#6CDDAB',
            borderRadius: 24,
            padding: 24,
            marginBottom: 12,
          }}>
          <Text style={{...ComponentStyle.largeWhiteTitle}}>Update Desk</Text>
          <InputTag
            placeholder={'Your Desk'}
            content={input}
            onValueChange={value => {
              setInput(value);
            }}
          />

          <InputTag
            placeholder={'Your Description'}
            content={description}
            onValueChange={value => {
              setDescription(value);
            }}
          />
          <MyCheckbox
            checked={accessStatus === 'PUBLIC'}
            setChecked={() => {
              setAccessStatus(accessStatus === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC');
            }}
          />
          <View style={{flexDirection: 'row-reverse'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#444',
                padding: 12,
                borderRadius: 24,
                margin: 4,
              }}
              onPress={() => {
                update();
              }}>
              <Text>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CircleButton
          style={{position: 'absolute', bottom: -60}}
          content={'x'}
          onClick={() => {
            close();
          }}
        />
      </View>
    </View>
  );
}

export function RadiusRetangleButton({content, onClick}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      style={{
        width: 40,
        height: 40,
        backgroundColor: '#6CDDAB',
        borderRadius: 10,
      }}>
      <Text style={{fontSize: 30, color: 'white', margin: 'auto'}}>
        {content}
      </Text>
    </TouchableOpacity>
  );
}

export function CreateNewCardPopUp({
  vocab,
  setVocab,
  description,
  setDescription,
  sentence,
  setSentence,
  close,
  create,
}) {
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}>
      <View style={{margin: 'auto'}}>
        <View
          style={{
            backgroundColor: '#6CDDAB',
            borderRadius: 24,
            padding: 24,
            marginBottom: 12,
          }}>
          <Text style={{...ComponentStyle.largeWhiteTitle}}>
            Create New Card
          </Text>
          <InputTag
            placeholder={'Your Vocab'}
            content={vocab}
            onValueChange={value => {
              setVocab(value);
            }}
          />
          <InputTag
            placeholder={'Description'}
            content={description}
            onValueChange={value => {
              setDescription(value);
            }}
          />
          <InputTag
            placeholder={'Sentences'}
            content={sentence}
            onValueChange={value => {
              setSentence(value);
            }}
          />
          <View style={{flexDirection: 'row-reverse'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#444',
                padding: 12,
                borderRadius: 24,
                margin: 4,
              }}
              onPress={() => {
                create();
              }}>
              <Text>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CircleButton
          style={{position: 'absolute', bottom: -60}}
          content={'x'}
          onClick={() => {
            close();
          }}
        />
      </View>
    </View>
  );
}

export function UpdateCardPopUp({
  vocab,
  setVocab,
  description,
  setDescription,
  sentence,
  setSentence,
  close,
  update,
}) {
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}>
      <View style={{margin: 'auto'}}>
        <View
          style={{
            backgroundColor: '#6CDDAB',
            borderRadius: 24,
            padding: 24,
            marginBottom: 12,
          }}>
          <Text style={{...ComponentStyle.largeWhiteTitle}}>Update Card</Text>
          <InputTag
            placeholder={'Your Vocab'}
            content={vocab}
            onValueChange={value => {
              setVocab(value);
            }}
          />
          <InputTag
            placeholder={'Description'}
            content={description}
            onValueChange={value => {
              setDescription(value);
            }}
          />
          <InputTag
            placeholder={'Sentences'}
            content={sentence}
            onValueChange={value => {
              setSentence(value);
            }}
          />
          <View style={{flexDirection: 'row-reverse'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#444',
                padding: 12,
                borderRadius: 24,
                margin: 4,
              }}
              onPress={() => {
                update();
              }}>
              <Text>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CircleButton
          style={{position: 'absolute', bottom: -60}}
          content={'x'}
          onClick={() => {
            close();
          }}
        />
      </View>
    </View>
  );
}
