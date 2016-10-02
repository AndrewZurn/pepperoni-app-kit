import {connect} from 'react-redux';
import WorkoutDetailsView from './WorkoutDetailView';

export default connect(
    state => ({
      workouts: state.getIn(['workoutState', 'workouts']),
      fusionUser: state.getIn(['auth', 'fusionUser']),
      isStartingWorkout: state.getIn(['workoutState', 'isStartingWorkout']),
      loading: state.getIn(['workoutState', 'loading']),
      saveCompletedWorkoutErrors: state.getIn(['workoutState', 'saveCompletedWorkoutErrors']),
      completedWorkout: state.getIn(['workoutState', 'completedWorkout'])
    })
)(WorkoutDetailsView);
