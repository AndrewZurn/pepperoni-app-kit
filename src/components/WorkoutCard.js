import React, {PropTypes} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text
} from 'react-native';
import {Card, Button} from 'react-native-material-design';
import Colors from '../utils/colors';
import * as WorkoutUtils from '../utils/workoutUtils';

var width = Dimensions.get('window').width;

const WorkoutCard = React.createClass({
  displayName: 'WorkoutCard',
  propTypes: {
    workout: PropTypes.object.isRequired,
    displayDay: PropTypes.bool.isRequired,
    displayRightButton: PropTypes.bool.isRequired,
    displayRightButtonText: PropTypes.string,
    rightButtonAction: PropTypes.func
  },

  render() {
    const workout = this.props.workout;
    let exerciseNameText = WorkoutUtils.getName(workout);
    let descriptionText = WorkoutUtils.getPreviewText(workout);

    let exerciseOptionsText = (
        WorkoutUtils.getExerciseOptions(workout).map(option => {
          if (option.targetAmount) { return option.targetAmount; }
          else if (option.duration) { return option.duration; }
          else { return 'Unknown'; }
        }).join(', ')
    );

    let rightButton;
    if (this.props.displayRightButton) {
      rightButton = <Button text={this.props.displayRightButtonText} onPress={this.props.rightButtonAction}/>;
    }

    let dayText = '';
    if (this.props.displayDay) {
      dayText = WorkoutUtils.getDay(workout);
    }

    return (
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Body>
              <Text style={[styles.text, {textAlign: 'center'}]}>{dayText}</Text>
              <Text style={styles.workoutTitle}>{exerciseNameText}</Text>
              <Text style={styles.text}>{descriptionText}</Text>
              <Text style={styles.text}>Exercise Preview: {exerciseOptionsText}</Text>
            </Card.Body>
            <Card.Actions position='right'>
              {rightButton}
            </Card.Actions>
          </Card>
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
  card: {
    width: width * 0.95,
    backgroundColor: Colors.spacLightGray
  },
  workoutTitle: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: Colors.titleSize,
    fontWeight: 'bold',
    color: Colors.spacGold,
    paddingBottom: 5,
    fontFamily: Colors.textStyle
  },
  text: {
    fontSize: Colors.textSize,
    color: Colors.spacCream,
    fontFamily: Colors.textStyle
  }
});

export default WorkoutCard;
