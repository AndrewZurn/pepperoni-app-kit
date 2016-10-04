import React, {PropTypes} from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  ScrollView,
  TextInput,
  Text,
  View
} from 'react-native';
import {Card, Button} from 'react-native-material-design';
import Colors from '../../../utils/colors';
import Picker from 'react-native-picker';
import * as WorkoutState from '../WorkoutState';
import * as WorkoutUtils from '../../../utils/workoutUtils';
import * as NavigationState from '../../navigation/NavigationState';

const BusyIndicator = require('react-native-busy-indicator');
const loaderHandler = require('react-native-busy-indicator/LoaderHandler');
const width = Dimensions.get('window').width;
const EXERCISE_OPTION_INPUT_WIDTH = 0.87;

const MINUTE_TEXT_VALUE = 'Minute';
const SECOND_TEXT_VALUE = 'Second';
const MINUTES_TEXT_VALUE = 'Minutes';
const SECONDS_TEXT_VALUE = 'Seconds';

const WorkoutDetailView = React.createClass({
  propTypes: {
    workouts: PropTypes.array,
    // is a details view or is a view for the workout in progress
    isStartingWorkout: PropTypes.bool.isRequired,
    fusionUser: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    saveCompletedWorkoutErrors: PropTypes.array,
    completedWorkout: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      // should be an {exerciseOptionId, isSelected, {exerciseOptionId, isSelected}}
      timedWorkoutBeingEdited: false,
      workoutSubmitted: false,
      result: null,
      displayedResult: null,
      workout: null
    };
  },

  componentWillMount() {
    let workout = this.props.isStartingWorkout ? this.props.workouts[0] : this.props.completedWorkout;
    let result = this.props.isStartingWorkout ? workout.result : null; // Get the result of the workout.
    this.setState({...this.state, workout, result});
  },

  componentWillUnmount() {
    this.setState(this.getInitialState());
  },

  _displayLoadingIndicatorWhenLoading() {
    if (this.props.loading) {
      loaderHandler.showLoader('Loading');
    } else {
      loaderHandler.hideLoader();
    }
  },

  _closeViewIfWorkoutSuccessfullySaved() {
    if (this.props.completedWorkout && this.state.workoutSubmitted) {
      Alert.alert(
        'Your Workout Was Saved',
        'You can view completed workouts from your profile, or adjust ' +
        'today\'s workout by going to the \'Workout\' tab.',
        [{text: 'OK', onPress: () => this.props.dispatch(NavigationState.popRoute())}]
      );
      this.setState({...this.state, workoutSubmitted: false});
    }
  },

  _saveCompletedWorkout(result) {
    let workoutId = this.state.workout.id;
    let userId = this.props.fusionUser.id;
    this.props.dispatch(WorkoutState.saveCompletedWorkout(result, userId, workoutId));
  },

  _updateWorkoutResult(value, displayValueAppender, isEndEditing) {
    let result;
    let displayedResult;
    if (isEndEditing) { // has exited the input picker/keyboard
      displayedResult = `${value}${displayValueAppender}`;
      result = value;
    }
    else { // still in input, so keep only the non-appended results displayed
      displayedResult = value;
      result = value;
    }
    this.setState({...this.state, result, displayedResult});
  },

  /**
   * Will produce an input component for a given exerciseOption. If the option is time based, it will
   * produce a button that will popup a time (min:sec) picker, if repetition based return an input that will
   * use the keyboard for input.
   *
   * If the view is in 'read-only' (!this.props.isStartinWorkout) mode, it will return a label
   * that will be displayed rather than in Input component.
   */
  _getInputComponent(workout) {

    let result;
    if (this.props.completedWorkout) {
      // return the result of the workout
      result = this.props.completedWorkout.result;
      if (!this.props.isStartingWorkout) { // return the 'read-only' mode
        return <Text style={[styles.text, {color: Colors.spacGold}]}>Result: {result}</Text>;
      }
    }

    if (workout.workoutType === 'TASK') {
      return (
        <Button
          text={this._getTimedButtonText()}
          raised={true}
          overrides={{
            textColor: Colors.defaultButtonColor,
            backgroundColor: Colors.spacMediumGray,
            rippleColor: Colors.spacLightGray
          }}
          onPress={() => {
            if (workout.workoutType === 'TASK' && this.picker) {
              this.picker.toggle();
              this.setState({...this.state, timedWorkoutBeingEdited: true});
            }
          }}
        />
      );
    } else if (workout.workoutType === 'NA') {
      return null;
    } else { // numeric
      let resultsDisplayFieldName;
      let resultsDisplayFieldAppender; // should be applied to the value of the field when entered/present (and not being edited)
      if (workout.workoutType === 'HEAVY') {
        resultsDisplayFieldName = ' Weight';
        resultsDisplayFieldAppender = 'lbs';
      } else {
        resultsDisplayFieldName = 'Repetitions';
        resultsDisplayFieldAppender = ' Repetitions';
      }

      let resultsPlaceholderText = `Enter ${resultsDisplayFieldName}`;
      if (this.props.completedWorkout && !this.state.displayedResult) {
        this.setState({...this.state, result, displayedResult: `${result} ${resultsDisplayFieldName}`});
      }

      return (
        <View>
          <TextInput
            style={[styles.textInput, {marginRight: 5, marginLeft: 5}]}
            keyboardType='numeric'
            // different displayValue when done editing to display something like (ie '50 Reps' or '200 lbs')
            onEndEditing={() => { // done editing, add the appender to use as the displayValue
              let value = this._getParsedResultValue(this.state.result);
              this._updateWorkoutResult(value, resultsDisplayFieldAppender, true);
            }}
            onFocus={() => { // reset the text box to use just the value (and not the displayValue)
              let value = this._getParsedResultValue(this.state.result);
              this._updateWorkoutResult(value, value, false);
            }}
            onChangeText={(text) => this._updateWorkoutResult(text, '', false) }
            placeholder={resultsPlaceholderText}
            placeholderTextColor={Colors.spacGold}
            value={this.state.displayedResult}/>
        </View>
      );
    }
  },

  _getParsedResultValue(result) {
    if (result && result.length > 0) {
      let value = result.split(' ')[0];
      return value;
    } else {
      return '';
    }
  },

  render() {
    this._displayLoadingIndicatorWhenLoading();
    this._closeViewIfWorkoutSuccessfullySaved();

    let workout = this.state.workout;

    let duration = WorkoutUtils.getDuration(workout);
    let durationText = duration ? <Text style={styles.text}>Duration: {duration}</Text> : null;
    let instructions = WorkoutUtils.getWorkoutInstructions(workout);
    let instructionsText = instructions && instructions.length > 0 ?
      <Text style={styles.text}>Instructions: {instructions}</Text> : null;

    // create views for the selected options
    let exerciseCards = WorkoutUtils.getExercises(workout).map(exercise => {
      let exerciseId = exercise.id;

      return (
        <Card style={styles.card} key={'card_' + exerciseId}>
          <Card.Body key={'card_body_' + exerciseId}>
            <View>
              <Text style={styles.workoutTitle} key={'name_' + exerciseId}>{exercise.name}</Text>
              <Text style={styles.text} key={'amt_' + exerciseId}>{exercise.amount}</Text>
              {/*{alternativeOptionView}*/}
            </View>
          </Card.Body>
        </Card>
      );
    });

    // create a 'Complete Workout' button if were currently doing a workout (will not display if view old workout)
    let completedWorkoutButton;
    if (this.props.isStartingWorkout) {
      completedWorkoutButton = (
        <View style={{marginTop: 4, marginBottom: 4}}>
          <Button
            text='Complete Workout'
            raised={true}
            overrides={{
              textColor: Colors.defaultButtonColor,
              backgroundColor: Colors.spacLightGray,
              rippleColor: Colors.spacMediumGray
            }}
            onPress={this._submitCompletedWorkout}
          />
        </View>
      );
    }

    // TODO: fix me... figure out why the 'workout' is different
    let localWorkout = this.props.isStartingWorkout ? workout.workout : workout.scheduledWorkout.workout;
    // ACTUAL RENDER RETURN
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Body>
            {durationText}
            {instructionsText}
          </Card.Body>
        </Card>
        <ScrollView ref='scrollView'
                    keyboardDismissMode='interactive'
                    style={styles.scrollView}>
          {exerciseCards}
        </ScrollView>
        {this._getInputComponent(localWorkout)}
        {completedWorkoutButton}

        {/* // picker for timed based results (displays minutes and seconds)*/}
        <Picker
          ref={picker => {
            this.picker = picker;
            return;
          }}
          style={{height: 280}}
          pickerElevation={100}
          pickerTitle={'Completed In'}
          pickerCancelBtnText={'Close'}
          pickerBtnText={'Save'}
          showMask={true}
          pickerToolBarStyle={{backgroundColor: Colors.spacMediumGray, height: 35}}
          pickerTitleStyle={styles.altTitle}
          pickerData={[this._getMinutesArray(), this._getSecondsArray()]} //picker`s value List
          selectedValue={[`0 ${MINUTES_TEXT_VALUE}`, `0 ${SECONDS_TEXT_VALUE}`]} //default to be selected value
          onPickerDone={(value) => {
            let parsedPickerValue = this._parseValueFromTimedBasedExerciseResult(value);
            this._updateWorkoutResult(parsedPickerValue, '', true);
          }}
        />
        <BusyIndicator />
      </View>
    );
  },

  _submitCompletedWorkout() {
    if (this.state.result === null || this.state.result.length < 0) {
      Alert.alert(
        'Cannot Submit Incomplete Workout',
        `Please enter your results for this workout.`,
        [{text: 'OK', onPress: () => console.log('Incomplete workouts OK button Pressed')}]
      );
    } else {
      this._saveCompletedWorkout(this.state.result);
      this.setState({...this.state, workoutSubmitted: true});
    }
  },

  _parseValueFromTimedBasedExerciseResult(value) {
    let minutes = value[0];
    let seconds = value[1];

    if (!minutes.includes(MINUTE_TEXT_VALUE) || !minutes.includes(MINUTES_TEXT_VALUE)) {
      minutes = minutes === '1' ? `${minutes} ${MINUTE_TEXT_VALUE}` : `${minutes} ${MINUTES_TEXT_VALUE}`;
    }

    if (!seconds.includes(SECOND_TEXT_VALUE) || !seconds.includes(SECONDS_TEXT_VALUE)) {
      seconds = seconds === '1' ? `${seconds} ${SECOND_TEXT_VALUE}` : `${seconds} ${SECONDS_TEXT_VALUE}`;
    }

    return `${minutes} ${seconds}`;
  },

  _getTimedButtonText() {
    return this.state.displayedResult ? this.state.displayedResult : 'Enter Timed Results';
  },

  _getMinutesArray() {
    return [...Array(31).keys()]
      .map(i => i % 10 === 0 ? `${i} ${MINUTES_TEXT_VALUE}` : `${i}`);
  },

  _getSecondsArray() {
    return [...Array(60).keys()]
      .map(i => i % 10 === 0 ? `${i} ${SECONDS_TEXT_VALUE}` : `${i}`);
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: Colors.spacMediumGray
  },
  radioButtonCentered: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10
  },
  card: {
    backgroundColor: Colors.spacLightGray
  },
  workoutTitle: {
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.spacGold,
    fontFamily: Colors.textStyle
  },
  altTitle: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontSize: Colors.textSize,
    color: Colors.spacGold,
    fontFamily: Colors.textStyle
  },
  text: {
    fontSize: Colors.textSize,
    flexWrap: 'wrap',
    color: Colors.spacCream,
    fontFamily: Colors.textStyle
  },
  textInput: {
    height: 35,
    textAlign: 'center',
    backgroundColor: Colors.spacLightGray,
    color: Colors.spacGold,
    fontFamily: Colors.textStyle
  },
  textInputParent: {
    height: 35,
    width: width * EXERCISE_OPTION_INPUT_WIDTH,
    marginTop: 10,
    justifyContent: 'center',
    borderBottomColor: Colors.spacGold,
    borderBottomWidth: 1
  },
  scrollView: {
    flex: 1
  }
});

export default WorkoutDetailView;
