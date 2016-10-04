import * as api from '../utils/api';
import * as configuration from '../utils/configuration';

const API_FAILED_REQUEST_WARNING = configuration.getConfiguration('API_FAILED_REQUEST_WARNING_MESSAGE');
const WORKOUTS_BASE_PATH = configuration.getConfiguration('SCHEDULED_WORKOUTS_PATH');
const GET_WORKOUT_BY_ID_PATH = workoutId => { return WORKOUTS_BASE_PATH + `/${workoutId}`; };
const GET_TODAYS_WORKOUT_PATH = WORKOUTS_BASE_PATH + '/today';
const GET_WEEKS_REMAINING_WORKOUTS_PATH = WORKOUTS_BASE_PATH + '/week';

export async function getWorkouts() {
  return api.get(WORKOUTS_BASE_PATH, API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getWorkouts. Error: ${error}`));
}

export async function getTodaysWorkout() {
  return api.get(GET_TODAYS_WORKOUT_PATH, API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getTodaysWorkouts. Error: ${error}`));
}

/**
 * Search for an workout with a given workoutId
 * @param workoutId {UUID} the id of the workout to find.
 * @returns {Promise}
 */
export async function getWorkout(workoutId) {
  return api.get(GET_WORKOUT_BY_ID_PATH(workoutId), API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getWorkouts(${workoutId}. Error: ${error}`));
}

export async function getWeeksRemainingWorkouts() {
  return api.get(GET_WEEKS_REMAINING_WORKOUTS_PATH, API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getWeeksRemainingWorkouts. Error: ${error}`));
}
