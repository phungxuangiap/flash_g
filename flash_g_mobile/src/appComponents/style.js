import {StyleSheet, TextInput} from 'react-native';

export const ComponentStyle = StyleSheet.create({
  inputStyle: {
    padding: 12,
    minWidth: 300,
    borderWidth: 1,
    borderColor: 'brown',
    borderRadius: 12,
    color: 'black',
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
    backgroundColor: '#333',
    opacity: 0.7,
  },
  deskContainer: {
    // flex: 1,
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    margin: 24,
    marginBottom: 0,
    borderColor: 'black',
  },
  largeWhiteTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
});
