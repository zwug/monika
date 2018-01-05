import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

const roundSeconds = [30, 20, 15]; // seconds for each round

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
  },
  round: {
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: '#fffff2',
  },
});

export default class Welcome extends React.Component {
  onRoundPress(roundIndex) {
    this.props.onRoundDurationChange(roundSeconds[roundIndex]);
  }

  render() {
    return (
      <View style={styles.container}>
        {roundSeconds.map((seconds, index) => (
          <TouchableHighlight
            key={index}
            style={styles.round}
            onPress={this.onRoundPress.bind(this, index)}
          >
            <Text style={styles.text} >
              {index + 1} раунд
            </Text>
          </TouchableHighlight>
        ))}
      </View>
    );
  }
}
