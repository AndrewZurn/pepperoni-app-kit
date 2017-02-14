import React from 'react';
import * as snapshot from '../utils/snapshot';

import {
  TouchableOpacity,
  ActionSheetIOS,
  StyleSheet
} from 'react-native';

/**
 * Simple developer menu, which allows e.g. to clear the app state.
 * It can be accessed through a tiny button in the bottom right corner of the screen.
 * ONLY FOR DEVELOPMENT MODE!
 */
const DeveloperMenu = React.createClass({
  displayName: 'DeveloperMenu',

  render() {
    if (!__DEV__) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.circle}
        />
    );
  }
});

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff'
  }
});

export default DeveloperMenu;
