import React, {PropTypes} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text
} from 'react-native';
import * as ScheduleState from './ScheduleState';
import WorkoutCard from '../../components/WorkoutCard';
import Colors from '../../utils/colors';

/**
 * Sample view to demonstrate navigation patterns.
 * @TODO remove this module in a live application.
 */
const ScheduleView = React.createClass({
  propTypes: {
    groupWorkouts: PropTypes.object,
    smallGroupWorkouts: PropTypes.object,
    pilatesWorkouts: PropTypes.object,
    events: PropTypes.object,
    scheduleType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  _getGroupWorkouts() {
    this.props.dispatch(ScheduleState.getGroupWorkouts());
  },
  _getSmallGroupWorkouts() {
    this.props.dispatch(ScheduleState.getSmallGroupWorkouts());
  },
  _getPilatesWorkouts() {
    this.props.dispatch(ScheduleState.getPilatesWorkouts());
  },
  _getEvents() {
    this.props.dispatch(ScheduleState.getEvents());
  },

  _getSchedule() {
    switch(this.props.scheduleType) {
      case 'group':
        this._getGroupWorkouts();
      case 'small_group':
        this._getSmallGroupWorkouts();
      case 'pilates':
        this._getPilatesWorkouts();
      case 'events':
        this._getEvents();
      default:
        break;
    }
  },

  _getScheduleCardsData() {
    switch(this.props.scheduleType) {
      case 'group':
        return this.props.groupWorkouts;
      case 'small_group':
        return this.props.smallGroupWorkouts;
      case 'pilates':
        return this.props.pilatesWorkouts;
      case 'events':
        return this.props.events;
      default:
        return {};
    }
  },

  render() {
    // let workoutCard = this.props.workouts.map((workout, index) =>
    //   <WorkoutCard
    //     key={'workout-card-' + index}
    //     workout={workout}
    //     displayDay={true}
    //     displayRightButton={false}/>
    // );
    let items = null;

    return (
      <View style={styles.container} onLayout={this._getSchedule}>
        <ScrollView ref='scrollView'
                    keyboardDismissMode='interactive'
                    style={styles.scrollView}>
          {items}
        </ScrollView>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: Colors.spacMediumGray
  },
  scrollView: {
    flex: 1
  }
});

export default ScheduleView;
