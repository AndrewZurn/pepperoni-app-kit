import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';
import * as WorkoutService from '../../services/workoutService';

// Initial state
const initialState = Map({
  workouts: [],
  loading: false
});

// Actions
const GET_WEEKS_REMAINING_WORKOUTS_REQUEST = 'SCHEDULE_STATE/GET_WEEKS_REMAINING_WORKOUTS_REQUEST';
const GET_WEEKS_REMAINING_WORKOUTS_RESPONSE = 'SCHEDULE_STATE/GET_WEEKS_REMAINING_WORKOUTS_RESPONSE';

// ACTION STATE FUNCTIONS
export function getWeeksRemainingWorkouts() {
  return {type: GET_WEEKS_REMAINING_WORKOUTS_REQUEST};
}

export async function requestGetWeeksRemainingWorkouts() {
  return {
    type: GET_WEEKS_REMAINING_WORKOUTS_RESPONSE,
    payload: await WorkoutService.getWeeksRemainingWorkouts(),
    receivedAt: Date.now()
  };
}

// REDUCERS
export default function ScheduleStateReducer(state = initialState, action = {}) {
  switch (action.type) {

    // REQUESTS
    case GET_WEEKS_REMAINING_WORKOUTS_REQUEST:
      return loop(
          state.set('loading', true),
          Effects.promise(requestGetWeeksRemainingWorkouts)
      );

    // RESPONSES
    case GET_WEEKS_REMAINING_WORKOUTS_RESPONSE:
      return state
          .set('loading', false)
          .set('workouts', action.payload);

    default:
      return state;
  }
}
