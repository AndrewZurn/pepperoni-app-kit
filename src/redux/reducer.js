import {Map} from 'immutable';
import {combineReducers} from 'redux-loop';
import NavigationStateReducer from '../modules/navigation/NavigationState';
import HomeStateReducer from '../modules/home/HomeState';
import ScheduleStateReducer from '../modules/schedule/ScheduleState';
import SessionStateReducer, {RESET_STATE} from '../modules/session/SessionState';

const reducers = {

  // Home sample app state. This can be removed in a live application
  counter: HomeStateReducer,

  // @NOTE: By convention, the navigation state must live in a subtree called `navigationState`
  navigationState: NavigationStateReducer,

  // Schedule view app state
  scheduleState: ScheduleStateReducer,

  session: SessionStateReducer
};

// initial state, accessor and mutator for supporting root-level
// immutable data with redux-loop reducer combinator
const immutableStateContainer = Map();
const getImmutable = (child, key) => child ? child.get(key) : void 0;
const setImmutable = (child, key, value) => child.set(key, value);

const namespacedReducer = combineReducers(
  reducers,
  immutableStateContainer,
  getImmutable,
  setImmutable
);

export default function mainReducer(state, action) {
  if (action.type === RESET_STATE) {
    return namespacedReducer(action.payload, action);
  }

  return namespacedReducer(state || void 0, action);
}
