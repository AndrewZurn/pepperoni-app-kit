import React, {PropTypes} from "react";
import {Dimensions, Image, StyleSheet, ScrollView, Text, View} from "react-native";
import {Card, Button} from "react-native-material-design";
import Colors from "../../utils/colors";
import Communications from 'react-native-communications';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

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
              Welcome
            </Text>
            <Text style={[styles.text]}>
              The <Text style={{color: Colors.spacGold}}>Saint Paul Athletic Club</Text> is the premier fitness and
              social club in the hear of historic downtown Saint Paul. The Club has a lot to offer,
              from state of the art amenities, high energy fitness classes, exquisite social events,
              and our wonderful hospitality.
            </Text>
            <Text style={[styles.text, {color: Colors.spacGold, textAlign: 'center', paddingTop: 8}]}>
              Club Hours:
            </Text>
            <Text style={[styles.text]}>
              <Text style={[styles.text, {color: Colors.spacGold}]}>Weekdays</Text> - 5am to 10pm{'\n'}
              <Text style={[styles.text, {color: Colors.spacGold}]}>Weekends</Text> - 7am to 8pm
            </Text>
            <Text style={[styles.text, {color: Colors.spacGold, textAlign: 'center'}]}>
              Address:
            </Text>
            <Text style={[styles.text]}>
              340 Cedar Street{'\n'}
              St. Paul, MN 55101
            </Text>
            <View style={styles.buttonView}>
              <Button
                text='Call'
                raised={true}
                overrides={{
                  textColor: Colors.spacGold,
                  backgroundColor: Colors.spacMediumGray,
                  rippleColor: Colors.spacGold,
                }}
                onPress={this._callSpac}
              />
              <Button
                text='Visit Website'
                raised={true}
                overrides={{
                  textColor: Colors.spacGold,
                  backgroundColor: Colors.spacMediumGray,
                  rippleColor: Colors.spacGold,
                }}
                onPress={this._openSpacWebsite}
              />
            </View>
          </Card.Body>
        </Card>
      </View>
    );
  },

  _callSpac() {
    Communications.phonecall("6512917722", true)
  },

  _openSpacWebsite() {
    Communications.web("http://www.thespac.com/home")
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
  },
  buttonView: {
    marginTop: 4,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  }
});

export default HomeView;
