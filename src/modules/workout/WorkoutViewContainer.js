import {connect} from 'react-redux';
import WorkoutView from './WorkoutView';
import {isInView, WORKOUT_INDEX} from '../AppRouter';

export default connect(
    state => ({
      completedWorkout: state.getIn(['workoutState', 'completedWorkout']),
      didSaveCompletedWorkout: state.getIn(['workoutState', 'didSaveCompletedWorkout']),
      error: state.getIn(['workoutState', 'error']),
      fusionUser: state.getIn(['auth', 'fusionUser']),
      isInView: isInView(state, WORKOUT_INDEX),
      remainingWorkoutUnlocks: state.getIn(['workoutState', 'remainingWorkoutUnlocks']),
      todaysWorkout: state.getIn(['workoutState', 'todaysWorkout']),
      workouts: state.getIn(['workoutState', 'workouts'])
    })
)(WorkoutView);
