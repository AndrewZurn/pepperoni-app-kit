import React, {PropTypes} from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    ScrollView,
    Text,
    View
} from 'react-native';
import {Card} from 'react-native-material-design';
import Colors from '../../utils/colors';

var height = Dimensions.get('window').height;

const HomeView = React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired
  },

  render() {
    return (
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Body>
              <Text style={styles.title}>
                Fusion by SPAC
              </Text>
              <Text style={[styles.text, {textAlign: 'center'}]}>
                Weekly Schedule:
              </Text>
              <Text style={styles.text}>
                <Text style={[styles.text, {color: Colors.spacGold}]}>Monday – Friday:</Text> 6:00 am, noon, 5:30 pm{'\n'}
                <Text style={[styles.text, {color: Colors.spacGold}]}>Saturday:</Text> 8 am and 9 am
              </Text>
              <Text style={[styles.text, {textAlign: 'center', paddingTop: 6}]}>
                Definitions:
              </Text>
              <Text style={styles.text}>
                <Text style={[styles.text, {color: Colors.spacGold}]}>AMRAP</Text> - As many rounds/reps As possible{'\n'}
                <Text style={[styles.text, {color: Colors.spacGold}]}>TASK</Text> - Finish task at hand as fast as possible{'\n'}
                <Text style={[styles.text, {color: Colors.spacGold}]}>HEAVY</Text> - Lift and form focused with heavy weight and additional exercise{'\n'}
                <Text style={[styles.text, {color: Colors.spacGold}]}>CARDIO</Text> - Cardio focused with bursts of exercises{'\n'}
                <Text style={[styles.text, {color: Colors.spacGold}]}>30:30</Text> - 30 seconds of work, 30 seconds of rest{'\n'}
                <Text style={[styles.text, {color: Colors.spacGold}]}>20:10</Text> - 20 seconds of work, 10 seconds of rest{'\n'}
              </Text>
            </Card.Body>
          </Card>
        </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 62,
    backgroundColor: Colors.spacMediumGray
  },
  card: {
    height: height * 0.8,
    backgroundColor: Colors.spacLightGray
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: Colors.titleSize + 2,
    fontWeight: 'bold',
    color: Colors.spacGold,
    paddingBottom: 4,
    fontFamily: Colors.textStyle
  },
  text: {
    fontSize: Colors.textSize - 1,
    color: Colors.spacCream,
    fontFamily: Colors.textStyle
  }
});

export default HomeView;
