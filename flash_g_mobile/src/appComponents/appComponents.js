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
import {
  accessTokenSelector,
  currentDesks,
  imageStateSelector,
  onlineStateSelector,
} from '../redux/selectors';
import axios from 'axios';
import {fetchUserById} from '../service/fetchUserById';
import {cloneDesk} from '../service/cloneDesk';
import {launchImageLibrary} from 'react-native-image-picker';
import {fetchImageOfDesk} from '../service/imageService';
import {
  icon_secondary,
  opposite,
  text_primary,
  text_secondary,
} from '../assets/colors/colors';
import {NewIcon} from '../assets/icons/NewIcon';
import ProgressIcon from '../assets/icons/ProgressIcon';
import PreviewIcon from '../assets/icons/PreviewIcon';
import EditIcon from '../assets/icons/EditIcon';
import TrashIcon from '../assets/icons/TrashIcon';
import PlusIcon from '../assets/icons/PlusIcon';
import ExitIcon from '../assets/icons/ExitIcon';

export function InputTag({placeholder, value, onValueChange}) {
  return (
    <View>
      <TextInput
        style={{...ComponentStyle.inputStyle}}
        value={value}
        onChangeText={newValue => {
          onValueChange(newValue);
        }}
      />
    </View>
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
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 50,
        backgroundColor: '#444',
      }}>
      <Text style={{fontSize: 12}}>{userNameShortHand}</Text>
    </View>
  );
}

export function DeskComponent({
  id,
  remote_id,
  original_id,
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
  const onlineState = useSelector(onlineStateSelector);
  const accessToken = useSelector(accessTokenSelector);
  const [image, setImage] = useState(undefined);
  const avata = useSelector(imageStateSelector);
  console.log(avata, original_id, avata[original_id]);
  // useEffect(() => {
  //   fetchImageOfDesk(accessToken, original_id).then(response => {
  //     setImage(response);
  //     console.log('IMAGE IMAGE', response);
  //   });
  // }, [onlineState]);
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      style={{...ComponentStyle.deskContainer, backgroundColor: 'white'}}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'column',
          position: 'relative',
        }}>
        <View
          style={{
            width: '100%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 8,
          }}>
          {avata[id] || avata[original_id] ? (
            <Image
              source={{uri: avata[id] || avata[original_id]}}
              style={{
                resizeMode: 'cover',
                flex: 1,
                aspectRatio: 1,
                borderRadius: 12,
              }}
            />
          ) : (
            <Text style={{color: 'black'}}>Image</Text>
          )}
        </View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            flexDirection: 'row',
          }}>
          {user ? (
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                padding: 6,
                marginRight: 8,
                borderBottomRightRadius: 12,
                borderBottomLeftRadius: 12,
              }}
              onPress={() => {
                onEdit();
              }}>
              <EditIcon width={24} height={24} />
            </TouchableOpacity>
          ) : (
            <></>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              padding: 6,
              borderBottomLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
            onPress={async () => {
              await deleteDesk(id);
              onDelete();
              console.log('delete desk');
            }}>
            <TrashIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginLeft: 8, marginRight: 8}}>
        <Text
          style={{
            ...ComponentStyle.mediumBlackTitle,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 4,
          }}>
          <TextAndSmallNewIcon text={news} />
          <TextAndSmallInProgressIcon text={progress} />
          <TextAndSmallPreviewIcon text={preview} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
            marginBottom: 12,
          }}>
          <AvataBaseWordComponent full_name={user ? user.full_name : 'Owner'} />
          <Text
            style={{
              color: 'black',
              fontWeight: '500',
              marginLeft: 4,
              fontSize: 12,
            }}>
            By
          </Text>
          <Text
            style={{
              color: text_primary,
              fontWeight: 'bold',
              marginLeft: 2,
              fontSize: 12,
            }}>
            {user ? user.full_name : 'Owner'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}></View>
      </View>
    </TouchableOpacity>
  );
}

export function ButtonImage({onPress, style}) {
  return (
    <TouchableOpacity onPress={onPress()} style={style}>
      <Image
        style={{width: 34, height: 34}}
        source={require('../assets/images/search.png')}
      />
    </TouchableOpacity>
  );
}
export function CountryFlag({onPress, style}) {
  return (
    <TouchableOpacity onPress={onPress()} style={style}>
      <Image
        style={{width: 34, height: 34}}
        source={require('../assets/images/flag.png')}
      />
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
          flexDirection: 'row',
          flex: 1,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            flex: 1,
            aspectRatio: 1,
            backgroundColor: 'white',
          }}>
          {img_url[id] ? (
            <Image
              source={{
                uri: img_url[id],
              }}
              style={{resizeMode: 'crop', flex: 1, aspectRatio: 1}}
            />
          ) : (
            <Image
              source={require('../assets/images/noimage.jpg')}
              style={{resizeMode: 'cover', flex: 1, aspectRatio: 1}}
            />
          )}
        </View>
        <View style={{flex: 2}}>
          <Text style={{...ComponentStyle.largeWhiteTitle}} numberOfLines={1}>
            {title}
          </Text>
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
      </View>
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
export function TextAndSmallNewIcon({text, style}) {
  return (
    <View
      style={{
        ...style,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: text_secondary}}>{text}</Text>
      <NewIcon width={24} height={24} color={icon_secondary} />
    </View>
  );
}
export function TextAndSmallInProgressIcon({text, style}) {
  return (
    <View
      style={{
        ...style,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: text_secondary}}>{text}</Text>
      <ProgressIcon width={24} height={24} color={icon_secondary} />
    </View>
  );
}
export function TextAndSmallPreviewIcon({text, style}) {
  return (
    <View
      style={{
        ...style,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: text_secondary}}>{text}</Text>
      <PreviewIcon width={24} height={24} color={icon_secondary} />
    </View>
  );
}
export function CircleButton({content, onClick, style}) {
  return (
    <View style={{...style, alignSelf: 'center'}}>
      <TouchableOpacity
        style={{
          margin: 'auto',
          backgroundColor: text_primary,
          alignSelf: 'baseline',
          justifyContent: 'center',
          borderRadius: 50,
          padding: 12,
        }}
        onPress={() => {
          onClick();
        }}>
        <PlusIcon width={50} height={50} />
      </TouchableOpacity>
    </View>
  );
}

export function ExitButton({onClick, style}) {
  return (
    <View>
      <TouchableOpacity
        style={{
          margin: 'auto',
          backgroundColor: opposite,
          alignSelf: 'baseline',
          justifyContent: 'center',
          borderRadius: 50,
          padding: 12,
        }}
        onPress={() => {
          onClick();
        }}>
        <ExitIcon width={50} height={50} />
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
        {checked && <Text style={{fontSize: 18, color: 'black'}}>✔</Text>}
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
  fileImage,
  setFileImage,
  accessStatus,
  setAccessStatus,
  close,
  create,
}) {
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.8,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else {
        setFileImage(response.assets[0]); // Lưu đường dẫn hình ảnh
      }
    });
  };
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
      <View style={{margin: 'auto', position: 'relative'}}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 36,
            marginBottom: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {fileImage ? (
              <Image
                source={{uri: fileImage.uri}}
                style={{width: 128, height: 128, borderRadius: 12}}
              />
            ) : (
              <Image source={require('../assets/images/blank_picture.png')} />
            )}
            <TouchableOpacity onPress={pickImage} style={{}}>
              <Text
                style={{
                  color: text_secondary,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Add Image
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 12}}>
            <Text style={{color: text_secondary, marginBottom: 6}}>
              Desk Title
            </Text>
            <InputTag
              placeholder={'Title'}
              content={input}
              onValueChange={value => {
                setInput(value);
              }}
            />
          </View>
          <View style={{marginBottom: 12}}>
            <Text style={{color: text_secondary, marginBottom: 6}}>
              Description
            </Text>
            <InputTag
              placeholder={'Description'}
              content={description}
              onValueChange={value => {
                setDescription(value);
              }}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: text_secondary, marginRight: 12}}>
              Public?
            </Text>
            <MyCheckbox
              checked={accessStatus === 'PUBLIC'}
              setChecked={() => {
                setAccessStatus(
                  accessStatus === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC',
                );
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row-reverse',
              justifyContent: 'center',
              marginTop: 24,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: text_primary,
                padding: 16,
                borderRadius: 28,
                margin: 4,
              }}
              onPress={() => {
                create();
              }}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ExitButton
          style={{position: 'absolute', top: 0, right: 0}}
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
  fileImage,
  setFileImage,
  close,
  update,
  desk,
}) {
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.8,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else {
        setFileImage(response.assets[0]); // Lưu đường dẫn hình ảnh
      }
    });
  };
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
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 36,
            marginBottom: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {fileImage ? (
              <Image
                source={{uri: fileImage.uri}}
                style={{width: 128, height: 128, borderRadius: 12}}
              />
            ) : (
              <Image source={require('../assets/images/blank_picture.png')} />
            )}
            <TouchableOpacity onPress={pickImage} style={{}}>
              <Text
                style={{
                  color: text_secondary,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Add Image
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 12}}>
            <Text style={{color: text_secondary, marginBottom: 6}}>
              Desk Title
            </Text>
            <InputTag
              placeholder={'Title'}
              content={input}
              onValueChange={value => {
                setInput(value);
              }}
            />
          </View>
          <View style={{marginBottom: 12}}>
            <Text style={{color: text_secondary, marginBottom: 6}}>
              Description
            </Text>
            <InputTag
              placeholder={'Description'}
              content={description}
              onValueChange={value => {
                setDescription(value);
              }}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={{color: text_secondary, marginRight: 12}}>
              Public?
            </Text>
            <MyCheckbox
              checked={accessStatus === 'PUBLIC'}
              setChecked={() => {
                setAccessStatus(
                  accessStatus === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC',
                );
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row-reverse',
              justifyContent: 'center',
              marginTop: 24,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: text_primary,
                padding: 16,
                borderRadius: 28,
                margin: 4,
              }}
              onPress={() => {
                update();
              }}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ExitButton
          style={{position: 'absolute', top: 0, right: 0}}
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
