/* eslint no-bitwise: 0 */
const {Platform} = require('react-native');

module.exports = {
  defaultButtonColor: '#2C98F0',
  spacGold: '#d29941',
  spacTan: '#c0b38e',
  spacCream: '#ece4ce',
  spacGray: '#141414',
  spacMediumGray: '#333333',
  spacLightGray: '#4d4d4d',
  textStyle: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif',
  textSize: 19,
  titleSize: 21
};
