import React, {PropTypes} from "react";
import {Dimensions, ScrollView, View, StyleSheet, Text} from "react-native";
import {Card} from "react-native-material-design";
import * as ScheduleState from "./ScheduleState";
import Colors from "../../utils/colors";

var width = Dimensions.get('window').width;

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
    switch (this.props.scheduleType) {
      case 'group':
        this._getGroupWorkouts();
        break;
      case 'small_group':
        this._getSmallGroupWorkouts();
        break;
      case 'pilates':
        this._getPilatesWorkouts();
        break;
      case 'events':
        this._getEvents();
        break;
      default:
        break;
    }
  },

  _getScheduleItems(index, item) {
    return <View key={'item_view_key' + index} style={[styles.cardContainer]}>
      <Text key={'item_day_text' + index} style={styles.dayOfWeekTitle}>{item.day}</Text>
      {item.classes.map((classItem, classIndex) =>
        <Card key={'item_card_key' + index + ':' + classIndex} style={styles.card}>
          <Card.Body key={'item_card_body_key' + index + ':' + classIndex}>
            <Text key={'item_name_key' + index + ':' + classIndex} style={styles.text}>
              <Text style={styles.textTitle}>Time:</Text> {classItem.time}
            </Text>
            <Text key={'item_class_key' + index + ':' + classIndex} style={styles.text}>
              <Text style={styles.textTitle}>Class:</Text> {classItem.name}
            </Text>
            <Text key={'item_instructor_key' + index + ':' + classIndex} style={styles.text}>
              <Text style={styles.textTitle}>Instructor:</Text> {classItem.instructor}
            </Text>
            <Text key={'item_location_key' + index + ':' + classIndex} style={styles.text}>
              <Text style={styles.textTitle}>Location:</Text> {classItem.room}
            </Text>
          </Card.Body>
        </Card>
      )}
    </View>;
  },

  _getScheduleCardsData() {
    switch (this.props.scheduleType) {
      case 'group':
        if (this.props.groupWorkouts && this.props.groupWorkouts.classSchedule) {
          return this.props.groupWorkouts.classSchedule.map((item, index) =>
            this._getScheduleItems(index, item)
          );
        } else {
          return [];
        }
      case 'small_group':
        if (this.props.smallGroupWorkouts && this.props.smallGroupWorkouts.classSchedule) {
          return this.props.smallGroupWorkouts.classSchedule.map((item, index) =>
            this._getScheduleItems(index, item)
          );
        } else {
          return [];
        }
      case 'pilates':
        if (this.props.pilatesWorkouts && this.props.pilatesWorkouts.classSchedule) {
          return this.props.pilatesWorkouts.classSchedule.map((item, index) =>
            this._getScheduleItems(index, item)
          );
        } else {
          return [];
        }
      case 'events':
        if (this.props.events && this.props.events.eventSchedule) {
          return this.props.events.eventSchedule.map((item, index) =>
            <View key={'item_view_key' + index} style={styles.cardContainer}>
              <Card key={'item_card_key' + index} style={styles.card}>
                <Card.Body key={'item_card_body_key' + index}>
                  <Text key={'item_title_key' + index} style={styles.workoutTitle}>
                    {item.name}
                  </Text>
                  <Text key={'item_date_key' + index} style={styles.text}>
                    <Text style={styles.textTitle}>Date:</Text> {item.date}
                  </Text>
                  <Text key={'item_location_key' + index} style={styles.text}>
                    <Text style={styles.textTitle}>Location:</Text> {item.location}
                  </Text>
                  <Text key={'item_description_key' + index} style={styles.text}>
                    <Text style={styles.textTitle}>Description:</Text> {item.description}
                  </Text>
                </Card.Body>
              </Card>
            </View>
          );
        } else {
          return [];
        }
      default:
        return {};
        break;
    }
  },

  render() {
    let items = this._getScheduleCardsData();

    return (
      <View style={styles.container} onLayout={this._getSchedule}>
        <ScrollView ref='scrollView'
                    keyboardDismissMode='interactive'>
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
  cardContainer: {
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
  dayOfWeekTitle: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: Colors.titleSize + 1,
    fontWeight: 'bold',
    color: Colors.spacGold,
    paddingBottom: 5,
    fontFamily: Colors.textStyle
  },
  textTitle: {
    color: Colors.spacTan,
  },
  text: {
    fontSize: Colors.textSize - 3,
    color: Colors.spacCream,
    fontFamily: Colors.textStyle
  }
});

export default ScheduleView;
