import React, {PropTypes} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text
} from 'react-native';
import Colors from '../../utils/colors';
import * as NavigationState from '../../modules/navigation/NavigationState';
import WorkoutCard from '../../components/WorkoutCard';
import * as WorkoutState from './WorkoutState';
import * as WorkoutUtils from '../../utils/workoutUtils';
import Immutable from 'immutable';

/**
 * @TODO remove this module in a live application.
 */
const WorkoutView = React.createClass({
  propTypes: {
    workouts: PropTypes.array.isRequired,
    remainingWorkoutUnlocks: PropTypes.number.isRequired,
    fusionUser: PropTypes.object.isRequired,
    completedWorkout: PropTypes.object,
    didSaveCompletedWorkout: PropTypes.bool.isRequired,
    error: PropTypes.object,
    isInView: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState() {
    return {currentDisplayedErrors: []};
  },
  _handlerStateErrors() {
    if (this.props.isInView &&
      this.props.error && this.props.error.type && this.props.error.message) {
      let errorType = this.props.error.type;
      if (errorType === WorkoutState.GET_TODAYS_WORKOUT_RESPONSE ||
        errorType === WorkoutState.GET_USER_REMAINING_WORKOUT_UNLOCKS_RESPONSE ||
        errorType === WorkoutState.GET_WORKOUT_RESPONSE) {
        this.props.dispatch(WorkoutState.errorAcknowledged());
        this._displayError(this.props.error.message);
      }
    }
  },
  _displayError(message) {
    var displayErrors = Immutable.fromJS(this.state.currentDisplayedErrors);
    if (!displayErrors.includes(message)) {
      Alert.alert(
        'Workout Error',
        this.props.error.message,
        [{
          text: 'OK',
          onPress: () => this.setState({...this.state, currentDisplayedErrors: displayErrors.pop(message)})
        }]
      );
      this.setState({...this.state, currentDisplayedErrors: displayErrors.push(message)});
    }
  },
  _getTodaysWorkout() {
    if (this.props.fusionUser) {
      // should set today's workout as head of 'workouts'
      this.props.dispatch(WorkoutState.getTodaysWorkout(this.props.fusionUser.id));
    }
  },
  _getRemainingWorkoutUnlocks() {
    if (this.props.fusionUser) {
      this.props.dispatch(WorkoutState.getRemainingWorkoutUnlocks(this.props.fusionUser.id));
    }
  },
  setupForWorkout() {
    this._getTodaysWorkout();
    this._getRemainingWorkoutUnlocks();
  },
  openWorkoutDetail() {
    this.props.dispatch(WorkoutState.setupForWorkoutDetails(true));
    let title = WorkoutUtils.getWorkoutName(this.props.workouts[0]);
    this.props.dispatch(NavigationState.pushRoute({key: 'DetailsForWorkout', title}));
  },

  render() {
    this._handlerStateErrors();

    let canUnlockWorkout = this.props.remainingWorkoutUnlocks > 0 || this.props.completedWorkout;
    let unlockWorkoutButtonText = 'Start Workout';
    if (this.props.completedWorkout) {
      unlockWorkoutButtonText = 'Edit Completed Workout';
    }

    let workoutCard;
    if (this.props.workouts && this.props.workouts.length > 0) {
      workoutCard = (
        <WorkoutCard workout={this.props.workouts[0]}
                     displayDay={false}
                     displayRightButton={canUnlockWorkout}
                     displayRightButtonText={unlockWorkoutButtonText}
                     rightButtonAction={this.openWorkoutDetail}
        />
      );
    }

    let remainingWorkoutsText;
    if (this.props.remainingWorkoutUnlocks) {
      remainingWorkoutsText = (
        <Text style={styles.remainingWorkoutsText}>
          Remaining Workout this Week: {this.props.remainingWorkoutUnlocks}
        </Text>
      );
    }

    return (
      <View style={styles.container} onLayout={this.setupForWorkout}>
        {workoutCard}
        {remainingWorkoutsText}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.spacMediumGray
  },
  remainingWorkoutsText: {
    fontSize: Colors.textSize,
    color: Colors.spacCream,
    textAlign: 'center',
    fontFamily: Colors.textStyle
  }
});

export default WorkoutView;
