import React, {PropTypes} from "react";
import {Dimensions, ScrollView, View, StyleSheet, Text, TouchableHighlight} from "react-native";
import {Card} from "react-native-material-design";
import Colors from "../../utils/colors";
import * as NavigationState from '../navigation/NavigationState';

var width = Dimensions.get('window').width;

/**
 * Sample view to demonstrate navigation patterns.
 * @TODO remove this module in a live application.
 */
const ScheduleView = React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired
  },
  _openGroupSchedule() {
    this.props.dispatch(NavigationState.pushRoute(
      {key: 'GroupSchedule', title: 'Group Fitness Schedule'}
    ));
  },
  _openSmallGroupSchedule() {
    this.props.dispatch(NavigationState.pushRoute(
      {key: 'SmallGroupSchedule', title: 'Small Group Fitness Schedule'}
    ));
  },
  _openPilatesSchedule() {
    this.props.dispatch(NavigationState.pushRoute(
      {key: 'PilatesSchedule', title: 'Pilates Schedule'}
    ));
  },

  _openSchedule(scheduleType) {
    switch (scheduleType) {
      case 'group':
        console.log('switching to group');
        this._openGroupSchedule();
        break;
      case 'small_group':
        console.log('switching to small group');
        this._openSmallGroupSchedule();
        break;
      case 'pilates':
        console.log('switching to pilates');
        this._openPilatesSchedule();
        break;
      default:
        break;
    }
  },

  render() {

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={ () => this._openSchedule('group') }>
          <View>
            <Card style={styles.card}>
              <Card.Body>
                <Text style={styles.workoutTitle}>Group Fitness Schedule</Text>
              </Card.Body>
            </Card>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={ () => this._openSchedule('small_group') }>
          <View>
            <Card style={styles.card}>
              <Card.Body>
                <Text style={styles.workoutTitle}>Small Group Fitness Schedule</Text>
              </Card.Body>
            </Card>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={ () => this._openSchedule('pilates') }>
          <View>
            <Card style={styles.card}>
              <Card.Body>
                <Text style={styles.workoutTitle}>Pilates Schedule</Text>
              </Card.Body>
            </Card>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: Colors.spacMediumGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1
  },
  cardContainer: {
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
    fontSize: Colors.titleSize - 2,
    fontWeight: 'bold',
    color: Colors.spacGold,
    paddingBottom: 5,
    fontFamily: Colors.textStyle
  },
  text: {
    fontSize: Colors.textSize - 3,
    color: Colors.spacCream,
    fontFamily: Colors.textStyle
  }
});

export default ScheduleView;
