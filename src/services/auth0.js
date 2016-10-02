import * as env from '../../env';
import Auth0Lock from 'react-native-lock';
import * as AuthStateActions from '../modules/auth/AuthState';
import store from '../redux/store';
const {Platform} = require('react-native');
import Colors from '../utils/colors';

const clientId = env.AUTH0_CLIENT_ID;
const domain = env.AUTH0_DOMAIN;
const authenticationEnabled = clientId && domain;

let lock = null;
if (authenticationEnabled) {
  lock = new Auth0Lock({
    clientId,
    domain
  });
} else {
  console.warn('Authentication not enabled: Auth0 configuration not provided');
}

export function showLogin() {
  if (!authenticationEnabled) {
    return;
  }

  const options = {
    closable: __DEV__,
  };

  if (Platform.OS === 'ios') {
    lock.customizeTheme({
      A0ThemePrimaryButtonNormalColor: Colors.spacLightGray,
      A0ThemePrimaryButtonHighlightedColor: Colors.spacGold,
      A0ThemeSecondaryButtonTextColor: Colors.spacTan,
      A0ThemeTextFieldTextColor: Colors.spacTan,
      A0ThemeTextFieldPlaceholderTextColor: Colors.spacTan,
      A0ThemeTextFieldIconColor: Colors.spacTan,
      A0ThemeTitleTextColor: Colors.spacGold,
      A0ThemeDescriptionTextColor: Colors.spacTan,
      A0ThemeSeparatorTextColor: Colors.spacLightGray,
      A0ThemeScreenBackgroundColor: '#000000',
      A0ThemeIconImageName: 'spac_logo',
      A0ThemeIconBackgroundColor: '#ffffff',
      A0ThemeCredentialBoxBorderColor: ''
    });
  }

  lock.show(options, (err, profile, token) => {
    if (err) {
      store.dispatch(AuthStateActions.onUserLoginError(err));
      return;
    }

    // Authentication worked!
    store.dispatch(AuthStateActions.onUserLoginSuccess(profile, token));
  });
}
