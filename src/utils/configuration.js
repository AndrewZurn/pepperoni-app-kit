import {Map} from 'immutable';
import * as env from '../../env';

let localConfig = Map({
  API_FAILED_REQUEST_WARNING_MESSAGE: false,
  API_ROOT: 'https://spac-mobile-editor.herokuapp.com'
});

let prodConfig = Map({
  API_FAILED_REQUEST_WARNING_MESSAGE: true,
  API_ROOT: 'https://spac-mobile-editor.herokuapp.com'
});

let configuration = getConfig();

export function setConfiguration(name, value) {
  configuration = configuration.set(name, value);
}

export function setAll(properties) {
  configuration = configuration.merge(properties);
}

export function unsetConfiguration(name) {
  configuration = configuration.delete(name);
}

export function getConfiguration(key) {
  if (!configuration.has(key)) {
    throw new Error('Undefined configuration key: ' + key);
  }

  return configuration.get(key);
}

function getConfig() {
  if (__DEV__) {
    return localConfig;
  } else {
    return prodConfig;
  }
}
