import React, {PropTypes} from 'react';
import {
  Dimensions,
  ScrollView,
  View,
  StyleSheet,
  Text
} from 'react-native';
import {Card} from 'react-native-material-design';
import * as ScheduleState from './ScheduleState';
import Colors from '../../utils/colors';

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
    switch(this.props.scheduleType) {
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

  _getScheduleCardsData() {
    switch(this.props.scheduleType) {
      case 'group':
        return this.props.groupWorkouts;
        break;
      case 'small_group':
        return this.props.smallGroupWorkouts;
        break;
      case 'pilates':
        return this.props.pilatesWorkouts;
        break;
      case 'events':
        if (this.props.events && this.props.events.eventSchedule) {
          return this.props.events.eventSchedule.map((item, index) =>
            <View key={'item_view_key' + index} style={styles.cardContainer}>
              <Card key={'item_card_key' + index} style={styles.card}>
                <Card.Body key={'item_card_body_key' + index}>
                  <Text key={'item_title_key' + index} style={styles.workoutTitle}>{item.name}</Text>
                  <Text key={'item_date_key' + index} style={styles.text}>{item.date}</Text>
                  <Text key={'item_location_key' + index} style={styles.text}>{item.location}</Text>
                  <Text key={'item_description_key' + index} style={styles.text}>{item.description}</Text>
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
    let items = this._getScheduleCardsData()

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
