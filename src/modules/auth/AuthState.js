import {Map, fromJS} from 'immutable';
import {loop, Effects} from 'redux-loop';
import * as UserService from '../../services/userService';

const _TEST_AUTH0_USER_ID = '123454321';
const _FUSION_USER_ID = 'ba729f5c-9781-4d88-bca7-f5098930eff7';

// Initial state
const initialState = Map({
  loading: false,
  isLoggedIn: false,
  currentUser: null,
  authenticationToken: null,
  fusionUser: null
});

// Actions
const USER_LOGIN_SUCCESS = 'AppState/USER_LOGIN_SUCCESS';
const USER_LOGIN_ERROR = 'AppState/USER_LOGIN_ERROR';

const GET_FUSION_USER_REQUEST = 'AppState/GET_FUSION_USER_REQUEST';
const GET_FUSION_USER_RESPONSE = 'AppState/GET_FUSION_USER_RESPONSE';

const UPDATE_USER_REQUEST = 'AppState/UPDATE_USER_REQUEST';
const UPDATE_USER_RESPONSE = 'AppState/UPDATE_USER_RESPONSE';

export function onUserLoginSuccess(profile, token) {
  return {
    type: USER_LOGIN_SUCCESS,
    payload: {
      profile: fromJS(profile),
      token: fromJS(token)
    }
  };
}

export function onUserLoginError(error) {
  return {
    type: USER_LOGIN_ERROR,
    payload: error,
    testFusionUserId: _FUSION_USER_ID,
    error: true
  };
}

export function getFusionUserRequest() {
  return {type: GET_FUSION_USER_REQUEST};
}

export async function requestGetFusionUser(auth0UserId) {
  return {
    type: GET_FUSION_USER_RESPONSE,
    payload: await UserService.getUserByAuth0Id(auth0UserId)
  };
}

export function updateUserRequest(user) {
  return {
    type: UPDATE_USER_REQUEST,
    user
  };
}

export async function requestUpdateUser(user) {
  return {
    type: UPDATE_USER_RESPONSE,
    payload: await UserService.updateUser(user),
    receivedAt: Date.now()
  };
}

// Reducer
export default function AuthStateReducer(state = initialState, action = {}) {
  var getAuth0UserId = () => {
    if (__DEV__ && !state.get('currentUser')) {
      return _TEST_AUTH0_USER_ID;
    } else {
      return state.get('currentUser').get('userId').split('|')[1];
    }
  };

  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return loop(
          state.set('isLoggedIn', true)
              .set('currentUser', action.payload.profile)
              .set('authenticationToken', action.payload.token),
          Effects.call(getFusionUserRequest)
      );

    case USER_LOGIN_ERROR:
      // used to bypass login and use a default created user
      return state.set('fusionUser', {id: action.testFusionUserId});

    case GET_FUSION_USER_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestGetFusionUser, getAuth0UserId())
      );

    case GET_FUSION_USER_RESPONSE:
      return state
          .set('loading', false)
          .set('fusionUser', action.payload);

    case UPDATE_USER_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestUpdateUser, action.user)
      );

    case UPDATE_USER_RESPONSE:
      return state
          .set('loading', false)
          .set('fusionUser', action.payload);

    default:
      return state;
  }
}
