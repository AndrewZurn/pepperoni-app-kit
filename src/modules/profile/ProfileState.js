import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';
import * as UserService from '../../services/userService';

var currentPage = 0;

// Initial state
const initialState = Map({
  completedWorkouts: [],
  loading: false
});

// ACTiONS
const GET_FUSION_USER_BY_AUTH0_ID_REQUEST = 'PROFILE_STATE/GET_FUSION_USER_BY_AUTH0_ID_REQUEST';
const GET_FUSION_USER_BY_AUTH0_ID_RESPONSE = 'PROFILE_STATE/GET_FUSION_USER_BY_AUTH0_ID_RESPONSE';

const GET_COMPLETED_WORKOUTS_REQUEST = 'PROFILE_STATE/GET_COMPLETED_WORKOUTS_REQUEST';
const GET_COMPLETED_WORKOUTS_RESPONSE = 'PROFILE_STATE/GET_COMPLETED_WORKOUTS_RESPONSE';

export function getFusionUserByAuth0Id(auth0UserId) {
  return {
    type: GET_FUSION_USER_BY_AUTH0_ID_REQUEST,
    auth0UserId
  };
}

export async function requestGetUseByAuth0Id(auth0UserId) {
  return {
    type: GET_FUSION_USER_BY_AUTH0_ID_RESPONSE,
    payload: await UserService.getUserByAuth0Id(auth0UserId),
    receivedAt: Date.now()
  };
}

export function getFusionUserCompletedWorkouts(fusionUserId, page) {
  return {type: GET_COMPLETED_WORKOUTS_REQUEST, fusionUserId, page};
}

export async function requestUserCompletedWorkouts(fusionUserId, page) {
  return {
    type: GET_COMPLETED_WORKOUTS_RESPONSE,
    payload: await UserService.getCompletedWorkouts(fusionUserId, page),
    receivedAt: Date.now()
  };
}

// REDUCERS
export default function ProfileStateReducer(state = initialState, action = {}) {
  switch (action.type) {

    case GET_FUSION_USER_BY_AUTH0_ID_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestGetUseByAuth0Id, action.auth0UserId)
      );

    case GET_FUSION_USER_BY_AUTH0_ID_RESPONSE:
      return loop(
          state.set('fusionUser', action.payload),
          Effects.promise(requestUserCompletedWorkouts, action.payload.id, currentPage)
      );

    case GET_COMPLETED_WORKOUTS_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestUserCompletedWorkouts, action.fusionUserId, action.page)
      );

    case GET_COMPLETED_WORKOUTS_RESPONSE:
      currentPage++;
      return state
          .set('loading', false)
          .set('completedWorkouts', action.payload);

    default:
      return state;
  }
}
