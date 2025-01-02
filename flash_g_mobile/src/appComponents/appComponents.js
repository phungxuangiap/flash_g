import {
  Text,
  TextInput,
  Touchable,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {ComponentStyle} from './style';
import {deleteDesk} from '../LocalDatabase/database';
import {updateCurrentDesks} from '../redux/slices/gameSlice';
import {desk} from '../LocalDatabase/dbQueries';
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

export function CardComponent({vocab, description}) {
  return (
    <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
      <Text style={{color: 'black'}}>{vocab}</Text>
      <Text style={{color: 'black'}}>{description}</Text>
    </View>
  );
}

export function DeskComponent({
  id,
  title,
  primaryColor,
  news,
  progress,
  preview,
  dispatch,
  onClick,
  onEdit,
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      style={{...ComponentStyle.deskContainer, backgroundColor: primaryColor}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <Text style={{...ComponentStyle.largeWhiteTitle}}>{title}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 20,
              borderColor: 'yellow',
            }}
            onPress={async () => {
              await deleteDesk(id);
              dispatch();
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
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <TextCircleBorder content={`${news} New`} color={'#C12450'} />
        <TextCircleBorder
          content={`${progress} In Progress`}
          color={'#444444'}
        />
        <TextCircleBorder content={`${preview} Preview`} color={'#6CDDAB'} />
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
export function CreateNewDeskPopUp({input, setInput, close, create}) {
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
            placeholder={'Your Desk'}
            content={input}
            onValueChange={value => {
              setInput(value);
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
export function UpdateDeskPopUp({input, setInput, close, update, desk}) {
  console.log(desk);
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
