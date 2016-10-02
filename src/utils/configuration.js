import {Map} from 'immutable';
import * as env from '../../env';

let baseConfig = {
  USERS_PATH: '/users',
  EXERCISES_PATH: '/exercises',
  WORKOUTS_PATH: '/workouts'
};

let localConfig = Map({
  ...baseConfig,
  API_FAILED_REQUEST_WARNING_MESSAGE: false,
  API_ROOT: 'http://localhost:8080'
});

let devConfig = Map({
  ...baseConfig,
  API_FAILED_REQUEST_WARNING_MESSAGE: false,
  API_ROOT: 'http://spac-fusion-api.us-west-2.elasticbeanstalk.com'
});

let prodConfig = Map({
  ...baseConfig,
  API_FAILED_REQUEST_WARNING_MESSAGE: true,
  API_ROOT: 'http://spac-fusion-api.us-west-2.elasticbeanstalk.com'
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
