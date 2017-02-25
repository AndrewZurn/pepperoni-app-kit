import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';
import * as ScheduleService from '../../services/scheduleServices';

// Initial state
const initialState = Map({
  groupWorkouts: null,
  smallGroupWorkouts: null,
  pilatesWorkouts: null,
  events: null,
  loading: false
});

// Actions
const GET_GROUP_WORKOUTS_REQUEST = 'SCHEDULE_STATE/GET_GROUP_WORKOUTS_REQUEST';
const GET_GROUP_WORKOUTS_RESPONSE = 'SCHEDULE_STATE/GET_GROUP_WORKOUTS_RESPONSE';

const GET_SMALL_GROUP_WORKOUTS_REQUEST = 'SCHEDULE_STATE/GET_SMALL_GROUP_WORKOUTS_REQUEST';
const GET_SMALL_GROUP_WORKOUTS_RESPONSE = 'SCHEDULE_STATE/GET_SMALL_GROUP_WORKOUTS_RESPONSE';

const GET_PILATES_WORKOUTS_REQUEST = 'SCHEDULE_STATE/GET_PILATES_WORKOUTS_REQUEST';
const GET_PILATES_WORKOUTS_RESPONSE = 'SCHEDULE_STATE/GET_PILATES_WORKOUTS_RESPONSE';

const GET_EVENTS_REQUEST = 'SCHEDULE_STATE/GET_EVENTS_REQUEST';
const GET_EVENTS_RESPONSE = 'SCHEDULE_STATE/GET_EVENTS_RESPONSE';

// ACTION STATE FUNCTIONS
export function getGroupWorkouts() {
  return {type: GET_GROUP_WORKOUTS_REQUEST};
}

export async function requestGetGroupWorkouts() {
  return {
    type: GET_GROUP_WORKOUTS_RESPONSE,
    payload: await ScheduleService.getGroupWorkouts()
  };
}

export function getSmallGroupWorkouts() {
  return {type: GET_GROUP_WORKOUTS_REQUEST};
}

export async function requestGetSmallGroupWorkouts() {
  return {
    type: GET_SMALL_GROUP_WORKOUTS_RESPONSE,
    payload: await ScheduleService.getSmallGroupWorkouts()
  };
}

export function getPilatesWorkouts() {
  return {type: GET_GROUP_WORKOUTS_REQUEST};
}

export async function requestGetPilatesWorkouts() {
  return {
    type: GET_PILATES_WORKOUTS_RESPONSE,
    payload: await ScheduleService.getPilatesWorkouts()
  };
}

export function getEvents() {
  return {type: GET_EVENTS_REQUEST};
}

export async function requestGetEvents() {
  return {
    type: GET_EVENTS_RESPONSE,
    payload: await ScheduleService.getEvents()
  };
}

// REDUCERS
export default function ScheduleStateReducer(state = initialState, action = {}) {
  switch (action.type) {

    // REQUESTS
    case GET_GROUP_WORKOUTS_REQUEST:
      if (!state.get('groupWorkouts')) {
        return loop(
            state.set('loading', true),
            Effects.promise(requestGetGroupWorkouts)
        );
      }

    case GET_SMALL_GROUP_WORKOUTS_REQUEST:
      if (!state.get('smallGroupWorkouts')) {
        return loop(
          state.set('loading', true),
          Effects.promise(requestGetSmallGroupWorkouts)
        );
      }

    case GET_PILATES_WORKOUTS_REQUEST:
      if (!state.get('pilatesWorkouts')) {
        return loop(
          state.set('loading', true),
          Effects.promise(requestGetPilatesWorkouts)
        );
      }

    case GET_EVENTS_REQUEST:
      if (!state.get('events')) {
        return loop(
          state.set('loading', true),
          Effects.promise(requestGetEvents)
        );
      }

    // RESPONSES
    case GET_GROUP_WORKOUTS_RESPONSE:
      return state
          .set('loading', false)
          .set('groupWorkouts', action.payload);

    case GET_SMALL_GROUP_WORKOUTS_RESPONSE:
      return state
        .set('loading', false)
        .set('smallGroupWorkouts', action.payload);

    case GET_PILATES_WORKOUTS_RESPONSE:
      return state
        .set('loading', false)
        .set('pilatesWorkouts', action.payload);

    case GET_EVENTS_RESPONSE:
      return state
        .set('loading', false)
        .set('events', action.payload);

    default:
      return state;
  }
}
