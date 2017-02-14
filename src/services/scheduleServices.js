import * as api from '../utils/api';
import * as configuration from '../utils/configuration';
import moment from 'moment';

const API_FAILED_REQUEST_WARNING = configuration.getConfiguration('API_FAILED_REQUEST_WARNING_MESSAGE');
const SCHEDULE_BASE_PATH = 'schedule/';
const GET_GROUP_SCHEDULE = SCHEDULE_BASE_PATH + 'group';
const GET_SMALL_GROUP_SCHEDULE = SCHEDULE_BASE_PATH + 'small_group';
const GET_PILATES_SCHEDULE = SCHEDULE_BASE_PATH + 'pilates';
const GET_EVENTS_SCHEDULE = 'events';

export async function getGroupWorkouts() {
  return api.get(GET_GROUP_SCHEDULE, API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getWorkouts. Error: ${error}`));
}

export async function getSmallGroupWorkouts() {
  return api.get(GET_SMALL_GROUP_SCHEDULE, API_FAILED_REQUEST_WARNING)
    .then(response => response.body)
    .catch(error => console.error(`Error during getWorkouts. Error: ${error}`));
}

export async function getPilatesWorkouts() {
  return api.get(GET_PILATES_SCHEDULE, API_FAILED_REQUEST_WARNING)
    .then(response => response.body)
    .catch(error => console.error(`Error during getWorkouts. Error: ${error}`));
}

export async function getEvents() {
  return api.get(GET_EVENTS_SCHEDULE, API_FAILED_REQUEST_WARNING)
    .then(response => response.body)
    .catch(error => console.error(`Error during getWorkouts. Error: ${error}`));
}