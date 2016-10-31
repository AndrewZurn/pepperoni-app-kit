import * as api from '../utils/api';
import * as configuration from '../utils/configuration';

const API_FAILED_REQUEST_WARNING = configuration.getConfiguration('API_FAILED_REQUEST_WARNING_MESSAGE');
const USERS_BASE_PATH = configuration.getConfiguration('USERS_PATH');
const SCHEDULED_WORKOUT_BASE_PATH = configuration.getConfiguration('SCHEDULED_WORKOUTS_PATH');
const USER_BY_ID_PATH = userId => USERS_BASE_PATH + `/${userId}`;
const CAN_USER_UNLOCK_WORKOUT = fusionUserId => USER_BY_ID_PATH(fusionUserId) + '/remaining-workout-unlocks';
const USER_BY_AUTH0_ID_PATH = auth0UserId => USERS_BASE_PATH + `/auth0/${auth0UserId}`;
const GET_COMPLETED_WORKOUTS_PATH = (fusionUserId, page) => {
  return USER_BY_ID_PATH(fusionUserId) + `${SCHEDULED_WORKOUT_BASE_PATH}?page=${page}&pageSize=150`;
};
const COMPLETED_WORKOUT_BY_DATE_PATH = (fusionUserId, workoutDate) => {
  return USER_BY_ID_PATH(fusionUserId) + `${SCHEDULED_WORKOUT_BASE_PATH}/${workoutDate}`;
};
const COMPLETED_WORKOUTS_PATH = (fusionUserId, workoutId) => {
  return USER_BY_ID_PATH(fusionUserId) + `${SCHEDULED_WORKOUT_BASE_PATH}/${workoutId}`;
};

export async function getUser(userId) {
  return api.get(USER_BY_ID_PATH(userId), API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getUser. Error: ${error}`));
}

export async function getRemainingWorkoutUnlocks(userId) {
  return api.get(CAN_USER_UNLOCK_WORKOUT(userId))
      .then(response => response.body)
      .catch(error => console.error(`Error during canUserUnlockWorkout. Error: ${error}`));
}

export async function getUserByAuth0Id(auth0UserId) {
  return api.get(USER_BY_AUTH0_ID_PATH(auth0UserId), API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getUser. Error: ${error}`));
}

export async function getCompletedWorkouts(fusionUserId, page) {
  return api.get(GET_COMPLETED_WORKOUTS_PATH(fusionUserId, page), API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during getCompletedWorkouts. Error: ${error}`));
}

export async function getCompletedWorkout(fusionUserId, workoutDate) {
  return api.get(COMPLETED_WORKOUT_BY_DATE_PATH(fusionUserId, workoutDate), API_FAILED_REQUEST_WARNING)
      .then(response => {
        if (response.status === 200) {
          return {completedWorkout: response.body};
        } else {
          return {completedWorkout: null};
        }
      }).catch(error => console.error(`Error during getCompletedWorkout. Error: ${error}`));
}

export async function updateUser(user) {
  return api.put(USER_BY_ID_PATH(user.id), user, API_FAILED_REQUEST_WARNING)
      .then(response => response.body)
      .catch(error => console.error(`Error during updateUser. Error: ${error}`));
}

export async function saveCompletedWorkout(result, userId, workoutId) {
  return api.post(
      COMPLETED_WORKOUTS_PATH(userId, workoutId),
      {result},
      API_FAILED_REQUEST_WARNING
  ).then(response => {
    if (response.status === 201) {
      return {completedWorkout: response.body};
    } else {
      return {completedWorkout: null};
    }
  }).catch(error => console.error(`Error during updateUser. Error: ${error}`));
}
