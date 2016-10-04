import moment from 'moment';

export function getWorkoutName(scheduledWorkout) {
  const workout = findWorkout(scheduledWorkout);
  return workout && workout.name ? workout.name : '';
}

export function getWorkoutInstructions(scheduledWorkout) {
  const workout = findWorkout(scheduledWorkout);
  return workout && workout.instructions ? workout.instructions : '';
}

export function getExercises(scheduledWorkout) {
  const workout = findWorkout(scheduledWorkout);
  return workout && workout.exercises ? workout.exercises : [];
}

export function getDuration(workout) {
  return workout && workout.duration ? workout.duration : '';
}

export function getDay(scheduledWorkout) {
  let dayText = '';
  if (scheduledWorkout && scheduledWorkout.workoutDate) {
    dayText = moment(scheduledWorkout.workoutDate).format('dddd');
  }
  return dayText;
}

function findWorkout(scheduledWorkout) {
  if (scheduledWorkout) {
    if (scheduledWorkout.workout)
      return scheduledWorkout.workout;
    else if (scheduledWorkout.scheduledWorkout)
      return scheduledWorkout.scheduledWorkout.workout;
    else
      return null;
  }
}
