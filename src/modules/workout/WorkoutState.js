import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';
import * as WorkoutService from '../../services/workoutService';
import * as UserService from '../../services/userService';

// Initial state
const initialState = Map({
  workouts: [],
  remainingWorkoutUnlocks: null,
  isStartingWorkout: false,
  completedWorkout: null,
  saveCompletedWorkoutErrors: [],
  loading: false,
  error: null // should have fields 'type' and 'message'
});


// Actions
const ERROR_ACKNOWLEDGED = 'WORKOUT_STATE/ERROR_ACKNOWLEDGED';

const GET_WORKOUTS_REQUEST = 'WORKOUT_STATE/GET_WORKOUTS_REQUEST';
const GET_WORKOUTS_RESPONSE = 'WORKOUT_STATE/GET_WORKOUTS_RESPONSE';

const GET_WORKOUT_REQUEST = 'WORKOUT_STATE/GET_WORKOUT_REQUEST';
export const GET_WORKOUT_RESPONSE = 'WORKOUT_STATE/GET_WORKOUT_RESPONSE';

const GET_TODAYS_WORKOUT_REQUEST = 'WORKOUT_STATE/GET_TODAYS_WORKOUT_REQUEST';
export const GET_TODAYS_WORKOUT_RESPONSE = 'WORKOUT_STATE/GET_TODAYS_WORKOUT_RESPONSE';

const GET_COMPLETED_WORKOUT_REQUEST = 'WORKOUT_STATE/GET_COMPLETED_WORKOUT_REQUEST';
export const GET_COMPLETED_WORKOUT_RESPONSE = 'WORKOUT_STATE/GET_COMPLETED_WORKOUT_RESPONSE';

const SET_COMPLETED_WORKOUT = 'WORKOUT_STATE/SET_COMPLETED_WORKOUT';

const GET_USER_REMAINING_WORKOUT_UNLOCKS_REQUEST = 'WORKOUT_STATE/GET_USER_REMAINING_WORKOUT_UNLOCKS_REQUEST';
export const GET_USER_REMAINING_WORKOUT_UNLOCKS_RESPONSE = 'WORKOUT_STATE/GET_USER_REMAINING_WORKOUT_UNLOCKS_RESPONSE';

const SETUP_FOR_WORKOUT_DETAILS = 'WORKOUT_STATE/SETUP_FOR_WORKOUT_DETAILS';

const SAVE_COMPLETED_WORKOUT_REQUEST = 'WORKOUT_STATE/SAVE_COMPLETED_WORKOUT_REQUEST';
const SAVE_COMPLETED_WORKOUT_RESPONSE = 'WORKOUT_STATE/SAVE_COMPLETED_WORKOUT_RESPONSE';

// ACTION STATE FUNCTIONS
export function errorAcknowledged() {
  return {type: ERROR_ACKNOWLEDGED};
}

export function getWorkout(id) {
  return {type: GET_WORKOUT_REQUEST, id};
}

export function getTodaysWorkout(userId) {
  return {type: GET_TODAYS_WORKOUT_REQUEST, userId};
}

export function getCompletedWorkout(userId, workoutId) {
  return {type: GET_COMPLETED_WORKOUT_REQUEST, userId, workoutId};
}

export function getRemainingWorkoutUnlocks(userId) {
  return {
    type: GET_USER_REMAINING_WORKOUT_UNLOCKS_REQUEST,
    userId
  };
}

/**
 * Setup for a DetailsView of a Workout.
 * @param isStartingWorkout {boolean} true if starting a workout,
 *                                    false if a normal details view is to be presented.
 * @returns {{type: string, isStartingWorkout: *}}
 */
export function setupForWorkoutDetails(isStartingWorkout) {
  return {
    type: SETUP_FOR_WORKOUT_DETAILS,
    isStartingWorkout
  };
}

export function saveCompletedWorkout(result, userId, workoutId) {
  return {
    type: SAVE_COMPLETED_WORKOUT_REQUEST,
    result,
    userId,
    workoutId
  };
}

export function setCompletedWorkout(workout) {
  return {type: SET_COMPLETED_WORKOUT, workout};
}

export async function requestGetWorkouts() {
  return {
    type: GET_WORKOUTS_RESPONSE,
    payload: await WorkoutService.getWorkouts(),
    receivedAt: Date.now()
  };
}

export async function requestGetWorkout(id) {
  return {
    type: GET_WORKOUT_RESPONSE,
    payload: await WorkoutService.getWorkout(id),
    receivedAt: Date.now()
  };
}

export async function requestGetTodaysWorkout(userId) {
  return {
    type: GET_TODAYS_WORKOUT_RESPONSE,
    userId,
    payload: await WorkoutService.getTodaysWorkout(),
    receivedAt: Date.now()
  };
}

export async function requestGetCompletedWorkout(userId, workoutId) {
  return {
    type: GET_COMPLETED_WORKOUT_RESPONSE,
    payload: await UserService.getCompletedWorkout(userId, workoutId),
    receivedAt: Date.now()
  };
}

export async function requestRemainingWorkoutUnlocks(userId) {
  return {
    type: GET_USER_REMAINING_WORKOUT_UNLOCKS_RESPONSE,
    payload: await UserService.getRemainingWorkoutUnlocks(userId),
    receivedAt: Date.now()
  };
}

export async function requestSaveCompletedWorkout(result, userId, workoutId) {
  return {
    type: SAVE_COMPLETED_WORKOUT_RESPONSE,
    payload: await UserService.saveCompletedWorkout(result, userId, workoutId),
    receivedAt: Date.now()
  };
}

// REDUCERS
export default function WorkoutStateReducer(state = initialState, action = {}) {
  switch (action.type) {

    // REQUESTS
    case GET_WORKOUTS_REQUEST:
      return loop(
        state.set('loading', true),
        Effects.promise(requestGetWorkouts)
      );

    case GET_WORKOUT_REQUEST:
      return loop(
        state.set('loading', true),
        Effects.promise(requestGetWorkout, action.id)
      );

    case GET_TODAYS_WORKOUT_REQUEST:
      return loop(
        state.set('loading', true),
        Effects.promise(requestGetTodaysWorkout, action.userId)
      );

    case GET_COMPLETED_WORKOUT_REQUEST:
      return loop(
        state.set('loading', true),
        Effects.promise(getCompletedWorkout, action.userId, action.workoutId)
      );

    case GET_USER_REMAINING_WORKOUT_UNLOCKS_REQUEST:
      return loop(
        state.set('loading', true),
        Effects.promise(requestRemainingWorkoutUnlocks, action.userId)
      );

    case SETUP_FOR_WORKOUT_DETAILS:
      return state.set('isStartingWorkout', action.isStartingWorkout);

    case SAVE_COMPLETED_WORKOUT_REQUEST:
      return loop(
        state.set('loading', true),
        Effects.promise(requestSaveCompletedWorkout, action.result, action.userId, action.workoutId)
      );

    case SET_COMPLETED_WORKOUT:
      return state.set('completedWorkout', action.workout);

    // RESPONSES
    case ERROR_ACKNOWLEDGED:
      return state.set('error', null);

    case GET_WORKOUTS_RESPONSE:
      return state
        .set('loading', false)
        .set('workouts', action.payload);

    case GET_WORKOUT_RESPONSE:
      if (action.payload && action.payload.id) {
        return state
          .set('loading', false)
          .set('workouts', [action.payload]);
      } else {
        return state
          .set('loading', false)
          .set('error', {
            type: GET_WORKOUT_RESPONSE,
            message: 'Could not find workout. Please try again later.'
          });
      }

    case GET_TODAYS_WORKOUT_RESPONSE:
      if (action.payload && action.payload.id) {
        return loop(
          state.set('workouts', [action.payload]),
          Effects.promise(requestGetCompletedWorkout, action.userId, action.payload.id)
        );
      } else {
        return state
          .set('loading', false)
          .set('error', {
            type: GET_TODAYS_WORKOUT_RESPONSE,
            message: 'Could not find today\'s workout. Please try again later.'
          });
      }

    case GET_COMPLETED_WORKOUT_RESPONSE:
      if (action.payload && action.payload.completedWorkout && action.payload.completedWorkout.id) {
        return state
          .set('loading', false)
          .set('completedWorkout', action.payload.completedWorkout);
      } else {
        return state
          .set('loading', false)
          .set('error', {
            type: GET_COMPLETED_WORKOUT_RESPONSE,
            message: 'Could not find information on completed workout.'
          });
      }

    case GET_USER_REMAINING_WORKOUT_UNLOCKS_RESPONSE:
      if (action.payload && action.payload.remainingWorkoutUnlocks) {
        return state
          .set('loading', false)
          .set('remainingWorkoutUnlocks', action.payload.remainingWorkoutUnlocks);
      } else {
        return state
          .set('loading', false)
          .set('remainingWorkoutUnlocks', 0)
          .set('error', {
            type: GET_USER_REMAINING_WORKOUT_UNLOCKS_RESPONSE,
            message: 'Could not retrieve information on remaining workout unlocks for the week.' +
            ' Please try again later.'
          });
      }

    case SAVE_COMPLETED_WORKOUT_RESPONSE:
      // don't update count if were editing the already saved workout
      return state
        .update('remainingWorkoutUnlocks', value => !state.get('completedWorkout') ? value - 1 : value)
        .set('loading', false)
        .set('completedWorkout', action.payload.completedWorkout)
        .set('saveCompletedWorkoutErrors', action.payload.saveCompletedWorkoutErrors);

    default:
      return state;
  }
}
