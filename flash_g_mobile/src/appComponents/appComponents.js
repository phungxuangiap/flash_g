import {Text, TextInput, Touchable, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ComponentStyle} from './style';
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
