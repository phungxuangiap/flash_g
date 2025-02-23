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
import {DeletedStatus, LightMode} from '../constants';
import {useSelector} from 'react-redux';
import {
  accessTokenSelector,
  currentDesks,
  imageStateSelector,
  modeStateSelector,
  onlineStateSelector,
} from '../redux/selectors';
import axios from 'axios';
import {fetchUserById} from '../service/fetchUserById';
import {cloneDesk} from '../service/cloneDesk';
import {launchImageLibrary} from 'react-native-image-picker';
import {fetchImageOfDesk} from '../service/imageService';
import {
  back_desk_dark,
  back_primary,
  icon_secondary,
  input_back,
  input_back_dark,
  opposite,
  text_primary,
  text_primary_dark,
  text_secondary,
} from '../assets/colors/colors';
import {NewIcon} from '../assets/icons/NewIcon';
import ProgressIcon from '../assets/icons/ProgressIcon';
import PreviewIcon from '../assets/icons/PreviewIcon';
import EditIcon from '../assets/icons/EditIcon';
import TrashIcon from '../assets/icons/TrashIcon';
import PlusIcon from '../assets/icons/PlusIcon';
import ExitIcon from '../assets/icons/ExitIcon';
import HeartIcon from '../assets/icons/HeartIcon';
import CommentIcon from '../assets/icons/CommentIcon';
import PullIcon from '../assets/icons/PullIcon';

export function InputTag({placeholder, value, onValueChange, isLightMode}) {
  return (
    <View>
      <TextInput
        style={{
          ...ComponentStyle.inputStyle,
          backgroundColor: isLightMode ? input_back : input_back_dark,
          color: isLightMode ? text_primary : text_primary_dark,
        }}
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
      <Text
        style={{
          alignSelf: 'center',
          color: 'white',
        }}>
        Loading...
      </Text>
    </View>
  );
}

export function CardComponent({
  card,
  dispatch,
  listAllCurrentCard,
  setShowUpdatePopUp,
  showUpdatePopUp,
  isSpecialColor,
  setVocab,
  setDescription,
  setSentence,
}) {
  const mode = useSelector(modeStateSelector);
  return (
    <View
      style={{
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: isSpecialColor
          ? mode === LightMode
            ? text_primary
            : text_primary_dark
          : 'white',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: isSpecialColor ? 'white' : 'black',
          flex: 1,
          textAlign: 'center',
        }}
        numberOfLines={1}>
        {card.vocab}
      </Text>
      <Text
        style={{
          color: isSpecialColor ? 'white' : 'black',
          flex: 1,
          textAlign: 'center',
        }}
        numberOfLines={1}>
        {card.description}
      </Text>
      <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
        <TouchableOpacity
          style={{
            padding: 6,
            borderColor: isSpecialColor ? 'white' : 'black',
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
          <TrashIcon
            width={18}
            height={18}
            color={isSpecialColor ? 'white' : 'black'}
          />
        </TouchableOpacity>
        <View style={{padding: 5}}></View>
        <TouchableOpacity
          style={{
            padding: 6,
            borderColor: isSpecialColor ? 'white' : 'black',
          }}
          onPress={() => {
            setShowUpdatePopUp();
            setVocab(card.vocab);
            setDescription(card.description);
            setSentence(card.sentence);
          }}>
          <EditIcon
            width={18}
            height={18}
            color={isSpecialColor ? 'white' : 'black'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function AvataBaseWordComponent({full_name, isLightMode}) {
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
        borderRadius: 50,
        backgroundColor: isLightMode ? '#444' : '#555',
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
  const mode = useSelector(modeStateSelector);
  const avata = useSelector(imageStateSelector);
  // console.log(avata, original_id, avata[original_id]);
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
      style={{
        ...ComponentStyle.deskContainer,
        width: 200,
        backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
      }}>
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
            backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
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
            <Image
              source={require('../assets/images/noimage.jpg')}
              style={{
                resizeMode: 'cover',
                flex: 1,
                aspectRatio: 1,
                borderRadius: 12,
              }}
            />
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
                backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
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
              backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
              padding: 6,
              borderBottomLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
            onPress={async () => {
              await deleteDesk(id);
              onDelete();
              console.log('delete desk');
            }}>
            <TrashIcon width={24} height={24} color={icon_secondary} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginLeft: 8, marginRight: 8}}>
        <Text
          style={{
            ...ComponentStyle.mediumBlackTitle,
            color: mode === LightMode ? 'black' : 'white',
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
          <TextAndSmallNewIcon text={news} isLightMode={mode === LightMode} />
          <TextAndSmallInProgressIcon
            text={progress}
            isLightMode={mode === LightMode}
          />
          <TextAndSmallPreviewIcon
            text={preview}
            isLightMode={mode === LightMode}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
            marginBottom: 12,
          }}>
          <AvataBaseWordComponent
            full_name={user ? user.full_name : 'Owner'}
            isLightMode={mode === LightMode}
          />
          <Text
            style={{
              color: mode === LightMode ? 'black' : 'white',
              fontWeight: '500',
              marginLeft: 4,
              fontSize: 12,
            }}>
            By
          </Text>
          <Text
            style={{
              color: mode === LightMode ? text_primary : text_primary_dark,
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
  isLightMode,
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
      style={{
        ...ComponentStyle.deskContainer,
        backgroundColor: isLightMode ? 'white' : back_desk_dark,
        flexDirection: 'column',
        // height: 600,
        padding: 24,
        paddingBottom: 0,
      }}>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AvataBaseWordComponent full_name={authorName} />
          <Text
            style={{
              marginLeft: 12,
              color: isLightMode ? 'black' : icon_secondary,
              fontWeight: 900,
            }}>
            {authorName}
          </Text>
        </View>
        {/* <Text style={{...ComponentStyle.largeWhiteTitle}} numberOfLines={1}>
          {title}
        </Text> */}
        <Text
          style={{
            color: isLightMode ? text_secondary : 'white',
            paddingTop: 12,
            paddingBottom: 12,
          }}>
          {description}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          aspectRatio: 1,
          backgroundColor: 'blue',
          position: 'relative',
        }}>
        {img_url ? (
          <Image
            source={{
              uri: img_url,
            }}
            style={{
              flex: 1,
              aspectRatio: 1,
            }}
            blurRadius={3}
          />
        ) : (
          <Image
            source={require('../assets/images/noimage.jpg')}
            style={{
              flex: 1,
              aspectRatio: 1,
            }}
            blurRadius={3}
          />
        )}
        <View
          style={{
            position: 'absolute',
            flex: 1,
            padding: 24,
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
          <Text
            style={{
              ...ComponentStyle.largeWhiteTitle,
              maxWidth: 300,
              textAlign: 'center',
              paddingBottom: 12,
            }}
            numberOfLines={2}>
            {title}
          </Text>
          <View
            style={{
              alignSelf: 'center',
            }}>
            <Text
              style={{
                padding: 12,
                borderRadius: 50,
                backgroundColor: isLightMode ? text_primary : text_primary_dark,
                color: 'white',
              }}>
              {numCard} Cards
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          // height: 10,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <HeartIcon width={34} height={34} color={icon_secondary} />
          <Text style={{color: isLightMode ? text_secondary : icon_secondary}}>
            12k
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
          <CommentIcon width={34} height={34} color={icon_secondary} />
          <Text style={{color: isLightMode ? text_secondary : icon_secondary}}>
            24
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginBottom: 24,
            marginTop: 24,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            onPull();
            cloneDesk(accessToken, id);
          }}>
          <PullIcon width={34} height={34} color={icon_secondary} />
          <Text style={{color: isLightMode ? text_secondary : icon_secondary}}>
            1.3k
          </Text>
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
export function TextAndSmallNewIcon({text, style, isLightMode}) {
  return (
    <View
      style={{
        ...style,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: isLightMode ? text_secondary : '#999'}}>{text}</Text>
      <NewIcon width={24} height={24} color={icon_secondary} />
    </View>
  );
}
export function TitleAndNumber({title, number, color}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: color || 'black',
        padding: 12,
        borderRadius: 24,
        margin: 6,
      }}>
      <Text style={{paddingRight: 6}}>{number}</Text>
      <Text>{title}</Text>
    </View>
  );
}
export function TextAndSmallInProgressIcon({text, style, isLightMode}) {
  return (
    <View
      style={{
        ...style,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: isLightMode ? text_secondary : '#999'}}>{text}</Text>
      <ProgressIcon width={24} height={24} color={icon_secondary} />
    </View>
  );
}
export function TextAndSmallPreviewIcon({text, style, isLightMode}) {
  return (
    <View
      style={{
        ...style,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: isLightMode ? text_secondary : '#999'}}>{text}</Text>
      <PreviewIcon width={24} height={24} color={icon_secondary} />
    </View>
  );
}
export function CircleButton({content, onClick, style, isLightMode}) {
  return (
    <View style={{...style, alignSelf: 'center'}}>
      <TouchableOpacity
        style={{
          margin: 'auto',
          backgroundColor: isLightMode ? text_primary : text_primary_dark,
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
export const MyCheckbox = ({checked, setChecked, isLightMode}) => {
  return (
    <View>
      <Pressable
        onPress={() => setChecked(!checked)}
        style={{
          width: 25,
          height: 25,
          borderWidth: 2,
          borderColor: isLightMode ? 'black' : icon_secondary,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {checked && (
          <Text
            style={{
              fontSize: 18,
              color: isLightMode ? 'black' : icon_secondary,
            }}>
            ✔
          </Text>
        )}
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
  isLightMode,
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
            backgroundColor: isLightMode ? 'white' : back_desk_dark,
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
                  color: isLightMode ? text_secondary : icon_secondary,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Add Image
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 12}}>
            <Text
              style={{
                color: isLightMode ? text_secondary : icon_secondary,
                marginBottom: 6,
              }}>
              Desk Title
            </Text>
            <InputTag
              placeholder={'Title'}
              content={input}
              onValueChange={value => {
                setInput(value);
              }}
              isLightMode={isLightMode}
            />
          </View>
          <View style={{marginBottom: 12}}>
            <Text
              style={{
                color: isLightMode ? text_secondary : icon_secondary,
                marginBottom: 6,
              }}>
              Description
            </Text>
            <InputTag
              placeholder={'Description'}
              content={description}
              onValueChange={value => {
                setDescription(value);
              }}
              isLightMode={isLightMode}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: isLightMode ? text_secondary : icon_secondary,
                marginRight: 12,
              }}>
              Public?
            </Text>
            <MyCheckbox
              checked={accessStatus === 'PUBLIC'}
              setChecked={() => {
                setAccessStatus(
                  accessStatus === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC',
                );
              }}
              isLightMode={isLightMode}
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
                backgroundColor: isLightMode ? text_primary : text_primary_dark,
                padding: 16,
                borderRadius: 28,
                margin: 4,
              }}
              onPress={() => {
                create();
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
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
  isLightMode,
}) {
  console.log('LIGHT MODE', isLightMode);
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
        console.log(response.assets[0]);
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
            backgroundColor: isLightMode ? 'white' : back_desk_dark,
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
                  color: isLightMode ? text_secondary : icon_secondary,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Add Image
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 12}}>
            <Text
              style={{
                color: isLightMode ? text_secondary : icon_secondary,
                marginBottom: 6,
              }}>
              Desk Title
            </Text>
            <InputTag
              placeholder={'Title'}
              content={input}
              value={input}
              onValueChange={value => {
                setInput(value);
              }}
              isLightMode={isLightMode}
            />
          </View>
          <View style={{marginBottom: 12}}>
            <Text
              style={{
                color: isLightMode ? text_secondary : icon_secondary,
                marginBottom: 6,
              }}>
              Description
            </Text>
            <InputTag
              placeholder={'Description'}
              content={description}
              value={description}
              onValueChange={value => {
                setDescription(value);
              }}
              isLightMode={isLightMode}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: isLightMode ? text_secondary : icon_secondary,
                marginRight: 12,
              }}>
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
                backgroundColor: isLightMode ? text_primary : text_primary_dark,
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
  const mode = useSelector(modeStateSelector);
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      style={{
        width: 40,
        height: 40,
        backgroundColor: mode === LightMode ? text_primary : text_primary_dark,
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
  const mode = useSelector(modeStateSelector);
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
            backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
            borderRadius: 24,
            padding: 24,
            marginBottom: 12,
          }}>
          <Text
            style={{
              ...ComponentStyle.largeWhiteTitle,
              textAlign: 'center',
              color: mode === LightMode ? text_primary : text_primary_dark,
            }}>
            Create Card
          </Text>
          <Text
            style={{
              color: icon_secondary,
              paddingTop: 12,
            }}>
            Title
          </Text>
          <InputTag
            placeholder={'Your Vocab'}
            content={vocab}
            onValueChange={value => {
              setVocab(value);
            }}
            isLightMode={mode === LightMode}
          />
          <Text
            style={{
              color: icon_secondary,
              paddingTop: 12,
            }}>
            Description
          </Text>
          <InputTag
            placeholder={'Description'}
            content={description}
            onValueChange={value => {
              setDescription(value);
            }}
            isLightMode={mode === LightMode}
          />
          <Text
            style={{
              color: icon_secondary,
              paddingTop: 12,
            }}>
            Sentence
          </Text>
          <InputTag
            placeholder={'Sentences'}
            content={sentence}
            onValueChange={value => {
              setSentence(value);
            }}
            isLightMode={mode === LightMode}
          />
          <View style={{alignSelf: 'center', margin: 12}}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  mode === LightMode ? text_primary : text_primary_dark,
                padding: 12,
                borderRadius: 24,
                margin: 4,
              }}
              onPress={() => {
                create();
              }}>
              <Text style={{color: 'white', fontSize: 18}}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ExitButton
          style={{position: 'absolute', bottom: -100}}
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
  const mode = useSelector(modeStateSelector);

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
            backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
            borderRadius: 24,
            padding: 24,
            marginBottom: 12,
          }}>
          <Text
            style={{
              ...ComponentStyle.largeWhiteTitle,
              textAlign: 'center',
              color: mode === LightMode ? text_primary : text_primary_dark,
            }}>
            Update Card
          </Text>
          <Text
            style={{
              color: icon_secondary,
              paddingTop: 12,
            }}>
            Title
          </Text>
          <InputTag
            placeholder={'Your Vocab'}
            value={vocab}
            onValueChange={value => {
              setVocab(value);
            }}
            isLightMode={mode === LightMode}
          />
          <Text
            style={{
              color: icon_secondary,
              paddingTop: 12,
            }}>
            Description
          </Text>
          <InputTag
            placeholder={'Description'}
            value={description}
            onValueChange={value => {
              setDescription(value);
            }}
            isLightMode={mode === LightMode}
          />
          <Text
            style={{
              color: icon_secondary,
              paddingTop: 12,
            }}>
            Sentence
          </Text>
          <InputTag
            placeholder={'Sentences'}
            value={sentence}
            onValueChange={value => {
              setSentence(value);
            }}
            isLightMode={mode === LightMode}
          />
          <View style={{alignSelf: 'center', margin: 12}}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  mode === LightMode ? text_primary : text_primary_dark,
                padding: 12,
                borderRadius: 24,
                margin: 4,
              }}
              onPress={() => {
                update();
              }}>
              <Text style={{color: 'white', fontSize: 18}}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ExitButton
          style={{position: 'absolute', bottom: -100}}
          content={'x'}
          onClick={() => {
            close();
          }}
        />
      </View>
    </View>
  );
}
