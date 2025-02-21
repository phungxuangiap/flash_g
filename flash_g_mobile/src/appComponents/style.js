import {StyleSheet, TextInput} from 'react-native';
import {input_back, text_primary} from '../assets/colors/colors';

export const ComponentStyle = StyleSheet.create({
  inputStyle: {
    padding: 12,
    paddingLeft: 20,
    minWidth: 300,
    borderRadius: 24,
  },
  button: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#6CDDAB',
  },
  textWhite16Medium: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'medium',
  },
  textBlack16Medium: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'medium',
  },
  loadingOverLay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    opacity: 0.7,
  },
  deskContainer: {
    // flex: 1,
    justifyContent: 'space-between',
    borderRadius: 16,
    margin: 8,
  },
  largeWhiteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  mediumBlackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
